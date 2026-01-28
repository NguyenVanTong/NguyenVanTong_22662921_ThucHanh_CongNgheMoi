# Product Management Application

(Node.js + Express + AWS)

---

## PHẦN 1. GIỚI THIỆU DỰ ÁN

Đây là ứng dụng **quản lý sản phẩm** được xây dựng bằng **Node.js (Express)** và **EJS**, triển khai trên nền tảng **Amazon Web Services (AWS)**.

### Chức năng chính

Ứng dụng hỗ trợ đầy đủ các chức năng **CRUD**:

* Create: Thêm sản phẩm (kèm hình ảnh)
* Read: Xem danh sách sản phẩm
* Update: Cập nhật thông tin sản phẩm
* Delete: Xóa sản phẩm (xóa cả dữ liệu và ảnh)

### Các dịch vụ AWS sử dụng

* **Amazon EC2**: Chạy ứng dụng Node.js
* **Amazon DynamoDB**: Lưu trữ dữ liệu sản phẩm
* **Amazon S3**: Lưu trữ hình ảnh sản phẩm
* **IAM Role**: Cấp quyền truy cập AWS an toàn

---

## PHẦN 2. TẠO DYNAMODB (CHI TIẾT)

### Bước 2.1: Truy cập DynamoDB

* Đăng nhập **AWS Console**
* Chọn **Services → DynamoDB**
* Nhấn **Create table**

### Bước 2.2: Cấu hình bảng

* **Table name**: `Products`
* **Partition Key**:

    * Name: `id`
    * Type: String


### Bước 2.3: Tạo bảng

* Nhấn **Create table**
* Đợi trạng thái bảng chuyển sang **ACTIVE**

### Giải thích

* DynamoDB là **NoSQL, schema-less**
* Chỉ cần định nghĩa **Partition Key**
* Các field như `name`, `price`, `quantity`, `imageUrl` sẽ **tự động được tạo khi PutItem**

---

## PHẦN 3. TẠO AMAZON S3

### Bước 3.1: Tạo bucket

* AWS Console → S3 → Create bucket
* Bucket name: `product-management`
* Region: `ap-southeast-1`

### Bước 3.2: Bỏ chặn public access

* Bỏ chọn **Block all public access**
* Xác nhận cảnh báo

### Bước 3.3: Cấu hình Bucket Policy (public read)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::product-management/*"
    }
  ]
}
```

### Mục đích

* Lưu trữ ảnh sản phẩm
* Cho phép hiển thị ảnh trực tiếp trên giao diện web

---

## PHẦN 4. TẠO IAM ROLE CHO EC2

### Bước 4.1: Tạo IAM Role

* AWS Console → IAM → Roles → Create role
* Trusted entity: **AWS service**
* Use case: **EC2**

### Bước 4.2: Gán policy

* `AmazonDynamoDBFullAccess`
* `AmazonS3FullAccess`

### Bước 4.3: Hoàn tất

* Role name: `EC2ProductManagerRole`
* Create role

### Giải thích

* IAM Role cung cấp **temporary credentials**
* An toàn hơn Access Key
* Không cần lưu key trong code hay `.env`

---

## PHẦN 5. TẠO EC2 INSTANCE (LINUX)

### Bước 5.1: Launch instance

* EC2 → Launch instance
* Name: `product-manager-server`

### Bước 5.2: Chọn AMI

* **Amazon Linux 2023**

### Bước 5.3: Instance type

* `t2.micro` hoặc `t3.micro` (Free Tier)

### Bước 5.4: Tạo Key Pair

* Create new key pair
* Format: `.pem`
* Tải về và lưu cẩn thận

### Bước 5.5: Network

* Allow SSH (port 22)
* Allow Custom TCP: port 3000

### Bước 5.6: Gán IAM Role

* Advanced details → IAM instance profile
* Chọn `EC2ProductManagerRole`

---

## PHẦN 6. KẾT NỐI EC2 TỪ WINDOWS BẰNG FILE `.pem`

### File `.pem` dùng để làm gì?

* Dùng để **SSH vào EC2**
* **KHÔNG liên quan đến AWS SDK hay quyền DynamoDB/S3**

### Kết nối bằng PowerShell / Git Bash

```bash
ssh -i product-manager.pem ec2-user@<PUBLIC_EC2_IP>
```

Nếu thấy:

```
[ec2-user@ip-xxx ~]$
```

→ Kết nối thành công

---

## PHẦN 7. CÀI MÔI TRƯỜNG TRÊN EC2

```bash
sudo yum update -y
sudo yum install git -y
```

### Cài Node.js v18

```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y
```

### Kiểm tra

```bash
node -v
npm -v
git --version
```

---

## PHẦN 8. CLONE SOURCE CODE TỪ GITHUB

```bash
git clone <GITHUB_REPO_URL>
cd <ten-thu-muc-project>
```

Kiểm tra cấu trúc:

* app.js
* package.json
* routes/
* views/

---

## PHẦN 9. CẤU HÌNH FILE `.env`

Tạo file `.env`:

```env
PORT=3000
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=product-management-nguyenvantong
```

📌 Không push `.env` lên GitHub
📌 Không cần Access Key vì EC2 dùng IAM Role

---

## PHẦN 10. CHẠY ỨNG DỤNG

```bash
npm install
node app.js
```

Truy cập:

```
http://<PUBLIC_EC2_IP>:3000
```

---

## PHẦN 11. CHẠY BẰNG PM2 (KHUYẾN NGHỊ)

```bash
npm install -g pm2
pm2 start app.js --name product-manager
pm2 save
```

Restart khi update code:

```bash
pm2 restart product-manager
```

---

## PHẦN 12. QUY TRÌNH UPDATE CODE

### Trên máy local

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Trên EC2

```bash
git pull origin main
npm install --production
pm2 restart product-manager
```

---

## PHẦN 13. LƯU Ý QUAN TRỌNG

* Không hard-code AWS Access Key
* Không push `.env`
* DynamoDB không cần schema
* IAM Role là best practice
* Stop EC2 khi không sử dụng để tiết kiệm chi phí


---

## PHẦN 14. THÔNG TIN SINH VIÊN

* **Tên sinh viên**: Nguyễn Văn Tòng
* **MSSV**: 22662921
* **Môn học**: Công Nghệ Mới

---
