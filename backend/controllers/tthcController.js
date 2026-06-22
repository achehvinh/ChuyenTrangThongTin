const db = require("../config/mysql");

exports.getGroups = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, slug, description, icon, sort_order
      FROM tthc_procedure_groups
      WHERE is_active = 1
      ORDER BY sort_order ASC, name ASC
    `);

    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProcedures = async (req, res) => {
  try {
    const { keyword = "", groupId, page = 1, limit = 9 } = req.query;
    const where = ["p.is_published = 1"];
    const params = [];

    if (groupId) {
      where.push("p.group_id = ?");
      params.push(groupId);
    }

    if (keyword.trim()) {
      const like = `%${keyword.trim()}%`;
      where.push(`(
        p.title LIKE ?
        OR p.summary LIKE ?
        OR p.description LIKE ?
        OR p.keywords LIKE ?
      )`);
      params.push(like, like, like, like);
    }

    const safeLimit = Math.min(Number(limit) || 9, 50);
    const safePage = Math.max(Number(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const [rows] = await db.query(
      `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.summary,
        p.processing_time,
        p.fee,
        p.agency,
        p.view_count,
        p.download_count,
        g.name AS group_name,
        g.slug AS group_slug
      FROM tthc_procedures p
      JOIN tthc_procedure_groups g ON g.id = p.group_id
      WHERE ${where.join(" AND ")}
      ORDER BY p.updated_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, safeLimit, offset]
    );

    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProcedureDetail = async (req, res) => {
  try {
    const [[procedure]] = await db.query(
      `
      SELECT p.*, g.name AS group_name, g.slug AS group_slug
      FROM tthc_procedures p
      JOIN tthc_procedure_groups g ON g.id = p.group_id
      WHERE p.slug = ? AND p.is_published = 1
      LIMIT 1
      `,
      [req.params.slug]
    );

    if (!procedure) {
      return res.status(404).json({ message: "Không tìm thấy thủ tục" });
    }

    await db.query("UPDATE tthc_procedures SET view_count = view_count + 1 WHERE id = ?", [
      procedure.id,
    ]);

    await db.query(
      `
      INSERT INTO tthc_procedure_view_logs (procedure_id, ip_address, user_agent)
      VALUES (?, ?, ?)
      `,
      [procedure.id, req.ip, req.get("user-agent") || ""]
    );

    const [steps] = await db.query(
      `
      SELECT id, step_number, title, content, note
      FROM tthc_procedure_steps
      WHERE procedure_id = ?
      ORDER BY step_number ASC
      `,
      [procedure.id]
    );

    const [forms] = await db.query(
      `
      SELECT id, title, file_type, original_name, file_size, download_count
      FROM tthc_procedure_forms
      WHERE procedure_id = ?
      ORDER BY created_at DESC
      `,
      [procedure.id]
    );

    res.json({ data: { ...procedure, view_count: procedure.view_count + 1, steps, forms } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const { procedureId, fullName, phone, question } = req.body;

    if (!fullName || !phone || !question) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const [result] = await db.query(
      `
      INSERT INTO tthc_citizen_questions (procedure_id, full_name, phone, question)
      VALUES (?, ?, ?, ?)
      `,
      [procedureId || null, fullName, phone, question]
    );

    res.status(201).json({
      message: "Đã gửi câu hỏi. Cán bộ sẽ phản hồi sớm.",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { procedureId, rating, comment, citizenName, phone } = req.body;

    if (!procedureId || !rating) {
      return res.status(400).json({ message: "Thiếu thông tin đánh giá" });
    }

    await db.query(
      `
      INSERT INTO tthc_procedure_reviews (procedure_id, rating, comment, citizen_name, phone)
      VALUES (?, ?, ?, ?, ?)
      `,
      [procedureId, rating, comment || null, citizenName || null, phone || null]
    );

    res.status(201).json({ message: "Đã ghi nhận đánh giá" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT step_id, is_completed, completed_at
      FROM tthc_procedure_step_progress
      WHERE session_id = ? AND procedure_id = ?
      `,
      [req.params.sessionId, req.params.procedureId]
    );

    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStepProgress = async (req, res) => {
  try {
    const { procedureId, isCompleted } = req.body;
    const completed = isCompleted ? 1 : 0;

    await db.query(
      `
      INSERT INTO tthc_procedure_step_progress
        (session_id, procedure_id, step_id, is_completed, completed_at)
      VALUES (?, ?, ?, ?, IF(? = 1, NOW(), NULL))
      ON DUPLICATE KEY UPDATE
        is_completed = VALUES(is_completed),
        completed_at = IF(VALUES(is_completed) = 1, NOW(), NULL)
      `,
      [req.params.sessionId, procedureId, req.params.stepId, completed, completed]
    );

    res.json({ message: "Đã cập nhật tiến độ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
