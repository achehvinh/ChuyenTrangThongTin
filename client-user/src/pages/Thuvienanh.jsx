import { useState } from 'react';
import './ThuVienAnh.css';

const DANH_MUC = ['Tất cả', 'Hoạt động xã hội', 'Văn hóa dân tộc', 'Thiên nhiên', 'Cộng đồng'];

const ANH_LIST = [
  {
    id: 1,
    url: 'https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/626028889_1291745662999036_5336633434013149137_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1365&ctp=s2048x1365&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHXP3_h7Rv30kJL4aSfyI31bc_DF67V17xtz8MXrtXXvPjzH5h9_N_muLf-Zz0iahdY0jHoARdoRuEll__E6ME6&_nc_ohc=piPb-8otdDgQ7kNvwHUtohl&_nc_oc=Adq2xonkvj7AjAHyVnx4CMRCX_Q_Ppl1kofWduVo1akNF1us6o_GxHb6A8Sk_6-GMOFBgIK_mDdsGOTkCBWuORjR&_nc_zt=23&_nc_ht=scontent.fdad1-2.fna&_nc_gid=61_Jpe5aB3jmTWL5x2quWQ&_nc_ss=7b2a8&oh=00_Af-QdEbcHgNkL-CFCD9Vqc_ysKOnN4KmvxGe1gCC9aVJrw&oe=6A392562',
    title: 'Bà con và các cháu nhỏ xã Đăk Pxi cùng nhau hội tụ, hân hoan dự lễ trong không khí thật ấm áp, nghĩa tình.',
    danh_muc: 'Văn hóa dân tộc',
    size: 'tall',
  },
  {
    id: 2,
    url: 'https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/630024646_1291745699665699_2932985401898157879_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1424&ctp=s2048x1424&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeETOoC7EbEYbWqrHBhCSj7RQYIX9O7rI2lBghf07usjafVNf08kafeoReZau7chDDRvdnuLckWFfH7EQurZ7-iD&_nc_ohc=IXeR13eLCmcQ7kNvwGCrf_p&_nc_oc=Adpn3zl0qJILLjjrWR234WSGHUroiJkgwdNuFUD1LiyCgUM8kkTF4zdaGBnQtraDKFDwCXO0SfnF6pXCzgJPVMu8&_nc_zt=23&_nc_ht=scontent.fdad1-2.fna&_nc_gid=_b_H17UHb15Abk9XA1tzcg&_nc_ss=7b2a8&oh=00_Af-Y1gOd199qPX84ZNHCTF3rqV9RDVbIKPCWp7GfrElirw&oe=6A3942C8',
    title: 'bà con và các em nhỏ đang cùng nhau nhảy múa vui tươi, hòa mình vào không khí lễ hội truyền thống vô cùng đặc sắc.',
    danh_muc: 'Văn hóa dân tộc',
    size: 'wide',
  },
  {
    id: 3,
    url: 'https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/484106471_1028733972633541_4025247298642484062_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1152&ctp=s2048x1152&_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeF2d3g2yfALJbW7Cqv-DporAFNDqJShvOIAU0OolKG84o_cIRqxbi94zTm54pyrB1kENcFUPRlb5kHEHK_Wq08Y&_nc_ohc=VXHKUjEWUQAQ7kNvwGZATuN&_nc_oc=AdqXJcNIdYW9pdynx6TgXRjthfzuQgQUOuobCGTurU-DTfQMHLYtWSb--GD6Fy6-RK5FkLwwKdZB7EMcKH3_7h_f&_nc_zt=23&_nc_ht=scontent.fdad1-3.fna&_nc_gid=4VP9XlDkE334Y-eUsgBk_A&_nc_ss=7b2a8&oh=00_Af-ihCGnPdHTYVKmG2OoSUF8flawIZktrvAKiYXVJF9Nmw&oe=6A396C0E',
    title: 'Cảnh thiên nhiên hùng vĩ, núi rừng Tây Nguyên tuyệt đẹp, là niềm tự hào của bà con xã Đăk Pxi. Hãy cùng nhau bảo vệ và gìn giữ thiên nhiên tươi đẹp này nhé!',
    danh_muc: 'Thiên nhiên',
    size: 'normal',
  },
  {
    id: 4,
    url: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/714303354_1388788643294737_2916122919442392633_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1365&ctp=s2048x1365&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFbBv5Ep-7Jdo3y6EyrmI57pQpybAqT5balCnJsCpPltuRSi1at5kN22iJQdD1HFXMG4s8G7ek_wFCe5fDjoK2h&_nc_ohc=_Hfk3JtFiM4Q7kNvwFy6F3W&_nc_oc=AdryFEViyoZDLS5oIHnVjkU_UBEX3ODrzkHcSHNWTiP7iLD9S2g8xO3e5wNGB9u2rUNCOgqDnrJ56SOSI8KYniSN&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=UG2pyLJGg1Vs9umKBebp9w&_nc_ss=7b2a8&oh=00_Af_i-phQkclDNHBd1ubNd9G-IHaxEAvntt2OJj1hEtcdFw&oe=6A39730C',
    title: 'Nhà rông truyền thống của bà con dân tộc thiểu số xã Đăk Pxi, nơi diễn ra các hoạt động văn hóa, lễ hội và sinh hoạt cộng đồng đặc sắc.',
    danh_muc: 'Văn hóa dân tộc',
    size: 'tall',
  },
  {
    id: 5,
    url: 'https://scontent.fdad1-1.fna.fbcdn.net/v/t39.30808-6/628006577_1289798106527125_5303563097150110237_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1365&ctp=s2048x1365&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGbbnOQTXyoacKTpg7uRJOS9jtvGUtuwU32O28ZS27BTWzM3L5x11-DNI103j5APk5oLzpM3IyPwFRa57kBYWwq&_nc_ohc=Ymrqw_nR4MAQ7kNvwHeuY6N&_nc_oc=Adof4doLI5mMzoub-um89OAJ4vydfaHTvPRJuOmAJ2_WiBYeISvNtp_qXoLsygqakqX1xSUSxXmrcclfDkCrNf2i&_nc_zt=23&_nc_ht=scontent.fdad1-1.fna&_nc_gid=4VXkY8l3gmV7a22g6U2PIQ&_nc_ss=7b2a8&oh=00_Af88CvdC0rhjAD97GypNiqCX7FVOa75skSjIS7wZuIwqXA&oe=6A3957F2',
    title: 'Sự kiện người dân xã Đăk Pxi tham gia các hoạt động cộng đồng, cùng nhau xây dựng và phát triển thôn bản, tạo nên một cộng đồng đoàn kết và vững mạnh.',
    danh_muc: 'Hoạt động xã hội',
    size: 'normal',
  },
  {
    id: 6,
    url: 'https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/476131064_1002559525250986_8554132027760135855_n.jpg?stp=dst-jpg_tt6&cstp=mx3049x1374&ctp=s3049x1374&_nc_cat=103&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeEHwPerYe1jKx18KWc-txT4oJaNL6pX3saglo0vqlfexiI6o2y_XWnGSAwxT8ONPxbBcGEmZN56cEOuiC0hn13D&_nc_ohc=L1TW0SJpPrwQ7kNvwHZ1ofP&_nc_oc=Ado8EH95Hxc9wMK8RS602aw6pAS-tVzES7iBABrJI6LzLjwD3YGmEzggo_Anvwd7N58LDQ8QIBxmDipmipd9aJAF&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=1bQGF95hD_p9J7DdJ_jeRQ&_nc_ss=7b2a8&oh=00_Af_TM1xDJ70XqkPRe0xapPoDdB-FgofLgLWac52yiZ7VVw&oe=6A398766',
    title: 'Núi rừng Tây Nguyên, sông suối và cảnh quan thiên nhiên hùng vĩ, là niềm tự hào của bà con xã Đăk Pxi. Hãy cùng nhau bảo vệ và gìn giữ thiên nhiên tươi đẹp này nhé!',
    danh_muc: 'Thiên nhiên',
    size: 'wide',
  },
  {
    id: 7,
    url: 'https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/709005691_1380789650761303_8001596722385484257_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1152&ctp=s2048x1152&_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEJshkVFvGIt32VnQ19tuG6jrJfsSbmQm-Osl-xJuZCb6CSwrcsuEQg0XLIM_a4r2J6A8wiTIfUqcqEcThpcvMK&_nc_ohc=pe3kT4AO7lsQ7kNvwFufKwT&_nc_oc=Adpep-bdyhm78inakGVvkKnBMRGGC2jUHDj53M1frfITTfXhb2x_qApVgwXKW0ljCBQlv9mKpSjc9Lo1cQ5O2cfU&_nc_zt=23&_nc_ht=scontent.fdad1-3.fna&_nc_gid=wWcT8D5lI9VA1k1TSvzGHQ&_nc_ss=7b2a8&oh=00_Af9mjcnNigfLfhSt2Q4MZFu9cKigLSnVV0KieGH8ilfQtQ&oe=6A397E3C',
    title: 'Trẻ em vùng cao đến trường, vươn lên trong môi trường học tập đầy đủ, an toàn và thân thiện, là niềm vui và hy vọng của bà con xã Đăk Pxi. ',
    danh_muc: 'Cộng đồng',
    size: 'normal',
  },
  {
    id: 8,
    url: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/472649407_1942409232914054_6110705543997189469_n.jpg?stp=dst-jpg_tt6&cstp=mx1939x1076&ctp=s1939x1076&_nc_cat=108&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeGqP4nAENAYJAvEr5aJgTmgWRxs6dojyAFZHGzp2iPIAUU0fidca25xRKP9NYVlBgsnFoi53K9FX2qx2RRr1AaK&_nc_ohc=hInQP9rm_n4Q7kNvwHWQKGD&_nc_oc=Adr92q4_31hR9vyPOdjCFbfVOtJosho57J1pN2S3xAaNiWFbYVr_1K5R98_WNFSFkvL2K5lZ4LP677F8SYG4SqGT&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=mcX8Z83XTdmDsXyuvxWeIA&_nc_ss=7b2a8&oh=00_Af-8aN2n9pQcXa1ETmFJuS_9mAUCy8pCHW8o2McvOzFsdw&oe=6A395AA9',
    title: 'Làng Đăk Xế Kơ Ne, xã Đăk Pxi, nơi bà con sinh sống, lao động và gìn giữ những giá trị văn hóa truyền thống đặc sắc của dân tộc thiểu số Tây Nguyên.',
    danh_muc: 'Thiên nhiên',
    size: 'tall',
  },
  {
    id: 9,
    url: 'https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/488499611_2987829651376494_4311826375618250163_n.jpg?stp=dst-jpg_tt6&cstp=mx963x1280&ctp=s963x1280&_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGZQMecgtoKdWjInEBmg2kBXiMbXraRmF9eIxtetpGYX_f8MPkZTIxwNOKQjrXGM9acYqVHXibQMGdXxPhG48SM&_nc_ohc=JhDVReXQ7SIQ7kNvwGzbA0E&_nc_oc=Adrm-_2Lr7jcsn3VpFpDs9tERVIpejQNQMtWF_z87C-CfSrGfNwEwZuIdbdtBi1Q4RvCoDBJn4jgaXYYg2qDpypP&_nc_zt=23&_nc_ht=scontent.fdad1-2.fna&_nc_gid=HGRwBpdIEiK8EaHVTYQLpA&_nc_ss=7b2a8&oh=00_Af-de1HChkNIPRY0zKvZRPRNOpZr2YH9i4KWX518gclWmA&oe=6A3980B5',
    title: 'Trò chơi dân gian bịt mắt bắt vịt trong lễ hội truyền thống của xã Đăk Pxi, mang lại niềm vui và tiếng cười sảng khoái cho bà con và các cháu nhỏ.',
    danh_muc: 'Văn hóa dân tộc',
    size: 'normal',
  },
  {
    id: 10,
    url: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/481706827_1019901160183489_6782692185820781473_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx2048x1153&ctp=s2048x1153&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFA4pcrW3IaI2S_-EXBNp_leu4-0vk8Jit67j7S-TwmK-CF99lpxJN7nIPzcsCsftPo92C0WWrLhjxSDyYCUK0e&_nc_ohc=xTunHRU4b2AQ7kNvwF25t7m&_nc_oc=AdqqYqKZLSP8Po13A1W2_dUdBMnL4cAGoo4BTUwGVEoMuFGr5XP4z8lu5IMbkHJRufPCEv5_Z99RBT9o9v1HRlhU&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=WLEiFbiebh-QbFx0qQmFZA&_nc_ss=7b2a8&oh=00_Af-kKzKp-aMOQ9sObKxeK8ZpoOXey9_LH-EBTEww0bOynQ&oe=6A398228',
    title: 'Hoạt động cộng đồng, mọi người cùng nhau tham gia các hoạt động xã hội, xây dựng và phát triển thôn bản, tạo nên một cộng đồng đoàn kết và vững mạnh.',
    danh_muc: 'Hoạt động xã hội',
    size: 'wide',
  },
  {
    id: 11,
    url: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/481776827_1019192220254383_3051409542994824551_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1009&ctp=s2048x1009&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFd5OQZb6InW94EcQ15qS_tVYZewbNOQSJVhl7Bs05BIrIVOUnfknfvS7gTihjvbGc7WCCwFGNkgaWqqa4_Pf--&_nc_ohc=m9z09oopCLIQ7kNvwE_XMGe&_nc_oc=AdpRY3qiUyl8GNCF70-roRnVxUmAyQSyxoEYQIXa53vG_2_RQHghzGR_-Pv56woOiCbzRzrZTulO_D_ogHbQ9rbN&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=bg_ql6ahf1PVYqjU3Z5Faw&_nc_ss=7b2a8&oh=00_Af-A361gAanl-mnPrRF2nxL_3x8iSN-yLfLOqVECFPHHkA&oe=6A396E86',
    title: 'Lễ hội bánh chưng xanh truyền thống của xã Đăk Pxi, nơi mọi người cùng nhau gói bánh, nấu bánh và thưởng thức những chiếc bánh chưng thơm ngon, đậm đà hương vị quê hương.',
    danh_muc: 'Văn hóa dân tộc',
    size: 'normal',
  },
  {
    id: 12,
    url: 'https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/627203892_1291745526332383_2847105206424567033_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFz-pSB1gxxBFANcYp6gZKPPUhzC0sjpuQ9SHMLSyOm5C-un3y2VJ8loxrSvcW_0J5i7VTaQU0OnjeErizQlDe6&_nc_ohc=QCfIKJ7Q8jwQ7kNvwG7OO7P&_nc_oc=AdqXHOSQg1vavMarOWdBHZCrAK6eYSd_wunVnwbdrHSs7_KieXwiWuZ6o-UcWk1iW96xvcsNy74NVGXRFHzEM-ux&_nc_zt=23&_nc_ht=scontent.fdad1-2.fna&_nc_gid=K7l5e3z5ykQN-uC6Dr8sqA&_nc_ss=7b2a8&oh=00_Af-mV9G3o_90HVuYTSOd9MYvKV0RS7YWGrJZcVGvn0UItg&oe=6A393328',
    title: 'mọi người đang hào hứng cổ vũ cho trò chơi bịt mắt bắt vịt rất vui nhộn trong lễ hội truyền thống của xã Đăk Pxi.',
    danh_muc: 'Văn hóa dân tộc',
    size: 'tall',
  },
  {
    id: 13,
    url: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/635086870_1297161349124134_213153866043317087_n.jpg?stp=dst-jpg_tt6&cstp=mx2500x1155&ctp=s2500x1155&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeH1bOI2PSaiC5Yh6_Ad8EagYGGIj7CRkURgYYiPsJGRRNXQG5LS1XJtJU1mkoZlEws9ZozL0LZEia6rUKO7UeB3&_nc_ohc=3SCb3yMkncgQ7kNvwFAlucL&_nc_oc=AdqVg5BL2YVjbwflFnYtEO7HKywBmA-_FY6dNtnxBwZRMdO129WtlJQ3dmd_g8L0pGVmNsUQZLcCbzOLAHoFie5g&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=ZVOHhEO2NVwEc-RgAVkVrA&_nc_ss=7b2a8&oh=00_Af_jh2XcrU1qNOAc_o4PsIUUe5i521r_mJAxGBFZ-EtLpw&oe=6A395C93',
    title: 'Tiêm chủng cho trẻ em, đảm bảo sức khỏe và phòng chống dịch bệnh, là một hoạt động quan trọng trong công tác chăm sóc sức khỏe cộng đồng của xã Đăk Pxi.',
    danh_muc: 'Hoạt động xã hội',
    size: 'normal',
  },
  {
    id: 14,
    url: 'https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/632731642_1296844412489161_2325368076679315628_n.jpg?stp=dst-jpg_tt6&cstp=mx1276x956&ctp=s1276x956&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEWAiUPOZ0wLzQNznsLUck6h1bL7MJ-V8uHVsvswn5Xy03K7NEoH4jsk_jWv5JgzUX6f3rYmLcczfxJ8NeXIJDC&_nc_ohc=yOCYUdUCQh4Q7kNvwEbY2Uh&_nc_oc=Adqi7xfOS2rQVCS8fNnF_FGPdIBW2B1Ua2chhbwAt2V6oaRlOoDECrYRfKz3gKVGRYWDyo8qQj759X5givBli9St&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=ohaYA4oODhVGt3B44n3kJQ&_nc_ss=7b2a8&oh=00_Af_sBQnRl5bIh7GC7ET1Cnx1NYHUdbOSfjySlkTP56NEjQ&oe=6A39696D',
    title: 'Những anh hùng thầm lặng, những người đã và đang ngày đêm bảo vệ, gìn giữ và phát triển thiên nhiên tươi đẹp của xã Đăk Pxi, là niềm tự hào của bà con và cộng đồng.',
    danh_muc: 'Hoạt động xã hội',
    size: 'wide',
  },
  {
    id: 15,
    url: 'https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/481263565_1014290180744587_2980606187177734392_n.jpg?stp=dst-jpg_tt6&cstp=mx1245x745&ctp=s1245x745&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGyKESfjHJxhuXiv9cDldQ9LRCL6Or4n7UtEIvo6viftdnnCXNFzsUOZDX42wE6f2VPoTz_FZBKxidKghY3cm6Z&_nc_ohc=24GTz3tiOmIQ7kNvwGwdey7&_nc_oc=Ado_qRaNt6NxaeIhnKUORRcLKy1YIhBee81FQyifWbAvkwcs9lUBDVUMcXqVYZUET0RkxL-cg9wpiBrz6eUirVqm&_nc_zt=23&_nc_ht=scontent.fdad1-3.fna&_nc_gid=bhFI8H6kzb0su4QZ9_PnqQ&_nc_ss=7b2a8&oh=00_Af-pnsaJNgNfxMY6fnXOUwmqm4ULz9iGvB1_RRUlT2kZeA&oe=6A396C61',
    title: 'Sinh hoạt cộng đồng, mọi người cùng nhau tham gia các hoạt động xã hội, xây dựng và phát triển thôn bản, tạo nên một cộng đồng đoàn kết và vững mạnh.',
    danh_muc: 'Cộng đồng',
    size: 'normal',
  },
  {
    id: 16,
    url: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/482021905_1020466936793578_4317500834781806670_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx2048x1153&ctp=s2048x1153&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHGIDYn5vlbZR05Uq3CEo0xOc_4pCPJW-Y5z_ikI8lb5kViOkc1Hf-GAJRNrcYx1vieYgCbNKRRWt0lc9N6IlD7&_nc_ohc=BI4-cja31aMQ7kNvwGjyzd2&_nc_oc=Adr3AwgasF5UMZXZHBnpyBFXCwPVnpy-Ci222M3xjMCihW8WLeUGQMBhi6M9ZT944_OFhkmI8YBNv0PCosW5I3Bj&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=tH_7AXynYeNjAhkNftFU5w&_nc_ss=7b2a8&oh=00_Af-irClXSA9vkbaCt65TmoDg-zLXdfPnHt560KMMJk9V1A&oe=6A3971EB',
    title: 'Đàn gia súc vùng cao của bà con xã Đăk Pxi, là nguồn sống và là niềm tự hào của cộng đồng dân tộc thiểu số Tây Nguyên.',
    danh_muc: 'Cộng đồng',
    size: 'normal',
  },
  {
    id: 17,
    url: 'https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/603891138_1258392083001061_5544894733334947298_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEkaLCA31hEquL24ZptxnaNRjA74VeB6kdGMDvhV4HqR4Jb4gz8jU3MylTjzbR-BsPvPdn0h4TRml5LnSsHfPPY&_nc_ohc=iApayMNAbBwQ7kNvwHfcgGr&_nc_oc=AdrcxdVsL9r-YTDOG4hDNAAJgtlXGB99l00cncE0L3-1b7HCqcT-8bxhaGm0UuQAqcPOAkaGVIM8S8fWprDZlXQX&_nc_zt=23&_nc_ht=scontent.fdad1-2.fna&_nc_gid=vqiK56XDAiYmjh-QQSt0UQ&_nc_ss=7b2a8&oh=00_Af-_qLSOhuP2RbClZDGlNZ0lvc_wRjG-WQfF7_joLzEhGQ&oe=6A393CC7',
    title: 'cả nhà mình cùng các cháu nhỏ vui vẻ bên những bộ cồng chiêng thật đáng quý, thân thương trong lễ hội truyền thống của xã Đăk Pxi.',
    danh_muc: 'Văn hóa dân tộc',
    size: 'wide',
  },
  {
    id: 18,
    url: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/627198320_1288971506609785_7244892424285343748_n.jpg?stp=dst-jpg_tt6&cstp=mx1207x869&ctp=s1207x869&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeF1r3K3Qg1Rn2vLKB9b0LrYKHkqqxOwv-4oeSqrE7C_7gQOlYQN5G3HEA976KTK-NdMuKfm0rLE-T0EDlAzFh_b&_nc_ohc=DWE3JL7A6G0Q7kNvwFKDjdJ&_nc_oc=AdrJT2TwnbLxPARrdXk0XfBf3ZRRxWfuqhv7dQBbFtgBRiUSvK-XeZ9H_qFnjEx-_Og25veVQRPTbFdPI3lSt91h&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=VT1c9lPILPQfA2_UaxIvlQ&_nc_ss=7b2a8&oh=00_Af-0QvLfrEvHvAZsyUqBr3dnM0kwS8Tqv0059p_3qrzTIg&oe=6A392308',
    title: 'Phát quà hỗ trợ bà con. Trao đi yêu thương, nhận lại nụ cười, ấm áp tình người lan tỏa nơi buôn làng thân thương của xã Đăk Pxi.',
    danh_muc: 'Hoạt động xã hội',
    size: 'normal',
  },
  {
    id: 19,
    url: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/602391843_1257026529804283_1852213945495593091_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1258&ctp=s2048x1258&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFoSo5kqGn8uqQ_50p2h7bJwV1PSoVMI9DBXU9KhUwj0E0H19t2RFXfQ4eYCKICy2J09OtO-kaf0S-pqOxQDBdE&_nc_ohc=DvwsdBe_UhAQ7kNvwET2YjJ&_nc_oc=AdooAyzEgIK0q5VGTny_GAEsc9-IDhCBAfoJqzDTJ_x0W7yYS4yuRrLyWv2fZek2brHeHTDNy7qoZ77nwVg4dDzB&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=DNBA0uoPcqtauf2gMDjPKQ&_nc_ss=7b2a8&oh=00_Af_vWfOYx3yyMpLMHDBzX1EW6fET35AuadAns9qFnfVZTg&oe=6A3918B7',
    title: 'Thiên nhiên vùng cao đẹp tuyệt vời, là nguồn sống, là niềm tự hào của bà con xã Đăk Pxi. Hãy cùng nhau bảo vệ và gìn giữ thiên nhiên tươi đẹp này nhé!',
    danh_muc: 'Thiên nhiên',
    size: 'tall',
  },
  {
    id: 20,
    url: 'https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/480437144_1011936034313335_1093750479205593707_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1171&ctp=s2048x1171&_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEAJvfBDSjfctvCF2crhZJ6xArYgRX7smrECtiBFfuyah_3iCn_stvpw-Ln57EDdgBv-X_ajZ6SDOJzLy76O9fG&_nc_ohc=VODnud4lC0wQ7kNvwElOHyk&_nc_oc=Adpc26_GeEISt556x3nmm7h1JJrObJQfw2wd1UHWMzwIwErGBUllfpnIGMi-43WzELRPkkqxtFz5muprvQWy7A2a&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=HK_d7Ws5pIUBl-ldmZjRNw&_nc_ss=7b2a8&oh=00_Af8vayHf2XndRRgjHnnxjWGE-jocGyq8kFTKXLagtAD6_g&oe=6A397F10',
    title: 'Bà con họp thôn bàn, cùng nhau bàn bạc, trao đổi và đưa ra những quyết định quan trọng cho sự phát triển của cộng đồng xã Đăk Pxi.',
    danh_muc: 'Hoạt động xã hội',
    size: 'normal',
  },
];

export default function ThuVienAnh() {
  const [filter, setFilter] = useState('Tất cả');
  const [anhPhongTo, setAnhPhongTo] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = ANH_LIST
    .filter(a => filter === 'Tất cả' || a.danh_muc === filter)
    .filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  const handleDownload = async (url, title) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = title + '.jpg';
      a.click();
    } catch {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="thuvien-page">

      {/* Header */}
      <div className="thuvien-header">
        <div className="thuvien-header-inner">
          <h1>🖼️ Thư viện ảnh</h1>
          <p>Hình ảnh hoạt động và cuộc sống của bà con xã Đăk Pxi</p>
        </div>
      </div>

      <div className="thuvien-inner">

        {/* Bộ lọc */}
        <div className="thuvien-filter">
          <input
            className="thuvien-search"
            type="text"
            placeholder="🔍 Tìm kiếm ảnh..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="thuvien-tags">
            {DANH_MUC.map(dm => (
              <button
                key={dm}
                className={`thuvien-tag ${filter === dm ? 'active' : ''}`}
                onClick={() => setFilter(dm)}
              >{dm}</button>
            ))}
          </div>
        </div>

        {/* Đếm ảnh */}
        <div className="thuvien-count">
          Hiển thị <strong>{filtered.length}</strong> ảnh
        </div>

        {/* Grid ảnh masonry */}
        <div className="thuvien-grid">
          {filtered.map(anh => (
            <div
              key={anh.id}
              className={`thuvien-item thuvien-item--${anh.size}`}
              onClick={() => setAnhPhongTo(anh)}
            >
              <img
                src={anh.url}
                alt={anh.title}
                className="thuvien-img"
                loading="lazy"
                onError={e => { e.target.parentElement.style.display = 'none'; }}
              />
              <div className="thuvien-overlay">
                <div className="thuvien-overlay-tag">{anh.danh_muc}</div>
                <div className="thuvien-overlay-title">{anh.title}</div>
                <div className="thuvien-overlay-icon">🔍 Xem</div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="thuvien-empty">Không có ảnh nào</div>
        )}

      </div>

      {/* Lightbox */}
      {anhPhongTo && (
        <div className="lightbox" onClick={() => setAnhPhongTo(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>

            <button className="lightbox-close" onClick={() => setAnhPhongTo(null)}>✕</button>

            <img
              src={anhPhongTo.url}
              alt={anhPhongTo.title}
              className="lightbox-img"
            />

            <div className="lightbox-footer">
              <div className="lightbox-info">
                <div className="lightbox-title">{anhPhongTo.title}</div>
                <div className="lightbox-tag">{anhPhongTo.danh_muc}</div>
              </div>
              <div className="lightbox-actions">
                <button
                  className="lightbox-btn lightbox-btn--save"
                  onClick={() => handleDownload(anhPhongTo.url, anhPhongTo.title)}
                >
                  💾 Lưu ảnh
                </button>
                <button
                  className="lightbox-btn lightbox-btn--close"
                  onClick={() => setAnhPhongTo(null)}
                >
                  ✕ Đóng
                </button>
              </div>
            </div>

          </div>
          <div className="lightbox-hint">Nhấn ra ngoài để đóng</div>
        </div>
      )}

    </div>
  );
}