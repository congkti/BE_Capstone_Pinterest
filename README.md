### Hướng dẫn:

- Chép source code này vô thư mục dự án
- Mở terminal tạo thư mục root của dự án, Chạy lệnh: **npm i** -> để cài Node package module
- Tạo database MySQL dùng file **mysql_capstone-pinterest.sql**
- Khai báo thông tin db trong file .env (nếu chưa có)
- Chạy 2 lệnh sau trên terminal để build database cho prisma:

```
  - npx prisma db pull
  - npx prisma generate
```

- Start server: npm run start

### Các File đính kèm source:

- File test Postman: **BaiTap_CongBui.postman_collection.json**
- File SQL: **mysql_capstone-pinterest.sql**
