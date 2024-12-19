# Dockerfile cho ReactJS
FROM node:20.14 AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt tất cả các phụ thuộc (bao gồm cả dev dependencies)
RUN npm install

# Cài đặt NestJS CLI toàn cục
RUN npm install -g @nestjs/cli

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Xây dựng ứng dụng
RUN npm run build

# Bước tạo image nhẹ nhất
FROM node:20.14 AS production

WORKDIR /app

# Sao chép build từ bước trước
COPY --from=build /app/dist ./dist

# Cài đặt lại chỉ những phụ thuộc cần thiết
COPY package*.json ./
RUN npm install --production

# Expose port
EXPOSE 8080

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
