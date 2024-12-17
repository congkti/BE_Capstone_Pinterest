-- =============================================================
-- Bài tập Capstone BE Express - Prisma - MySQL: app_pinterest
-- Handler: Bùi Hữu Công - NodeJS 45 
-- =============================================================

-- 1. XÂY DỰNG CSDL & NHẬP DỮ LIỆU VÀO BẢNG:

-- 1.1. Tạo Database app_pinterest
CREATE DATABASE IF NOT EXISTS app_pinterest;
 
USE app_pinterest

-- 1.2. Tạo bảng user và nhập liệu
CREATE TABLE IF NOT EXISTS roles (
	role_id INT PRIMARY KEY AUTO_INCREMENT,
	role_name VARCHAR(100) NOT NULL UNIQUE,
	role_description VARCHAR(200),
	is_active BOOLEAN DEFAULT TRUE,
	
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
	user_id INT PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	user_name VARCHAR(100) UNIQUE,
	
	first_name VARCHAR(100),
	last_name VARCHAR(100),
	full_name VARCHAR(100),
	age INT,
	avatar VARCHAR(255),
	user_bio TEXT,
	user_web VARCHAR(255),
	
	role_id INT NOT NULL DEFAULT 2,
	FOREIGN KEY (role_id) REFERENCES roles (role_id),

	is_deleted BOOLEAN DEFAULT FALSE,
	
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 1.3. Tạo bảng Tags phân loại hình ảnh + danh sách hình ảnh + hình ảnh lưu lại
CREATE TABLE IF NOT EXISTS tags (
	tag_id INT PRIMARY KEY AUTO_INCREMENT,
	tag_name VARCHAR(100) NOT NULL UNIQUE,
	
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pictures (
	pic_id INT PRIMARY KEY AUTO_INCREMENT,
	pic_name VARCHAR(100) NOT NULL,
	pic_url VARCHAR(255) NOT NULL,
	pic_description TEXT NOT NULL,
	
	user_id INT,
	FOREIGN KEY (user_id) REFERENCES users (user_id),
	
	is_deleted BOOLEAN DEFAULT FALSE,
	
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- tags - pictures: N - N
CREATE TABLE IF NOT EXISTS pictures_tags (
	pic_tag_id INT PRIMARY KEY AUTO_INCREMENT,
	
	pic_id INT,
	FOREIGN KEY (pic_id) REFERENCES pictures (pic_id),
	tag_id INT,
	FOREIGN KEY (tag_id) REFERENCES tags (tag_id),
	
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS save_picture (
	save_id INT PRIMARY KEY AUTO_INCREMENT,
	
	user_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users (user_id),
	
	pic_id INT NOT NULL,
	FOREIGN KEY (pic_id) REFERENCES pictures (pic_id),
	
	save_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
	comment_id INT PRIMARY KEY AUTO_INCREMENT,
	
	user_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users (user_id),
	pic_id INT NOT NULL,
	FOREIGN KEY (pic_id) REFERENCES pictures (pic_id),
	
	comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	comment_content TEXT NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE,
	
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	
);


-- NHẬP DỮ LIỆU:

-- 2.0. Nhập ROLE user
INSERT IGNORE INTO roles (role_name, role_description ) VALUES
('ROLE_ADMIN', 'Quản trị viên'),
('ROLE_USER', 'Người dùng') 
ON DUPLICATE KEY UPDATE role_description = VALUES(role_description);

-- 2.1. Fake data cho bảng users với passwordHash (admin/123 | user/password123) (20 users)
INSERT INTO users (full_name, email, password, age, role_id, is_deleted) VALUES
('Công Bùi', 'cong@gmail.com', '$2b$10$MtGr.i/YmFIMXzHV/QWfz.BaBJwu108X5Y5/ixzbo8qshAD9B/YWm', 40, 1, FALSE),
('JohnDoe', 'john.doe@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 25, 2, FALSE),
('JaneSmith', 'jane.smith@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 28, 2, FALSE),
('Alice Johnson', 'alice.johnson@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 22, 2, FALSE),
('Bob Brown', 'bob.brown@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 30, 2, FALSE),
('Charlie Davis', 'charlie.davis@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 35, 2, FALSE),
('Daniel Evans', 'daniel.evans@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 27, 2, FALSE),
('Emily White', 'emily.white@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 24, 2, FALSE),
('Frank Harris', 'frank.harris@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 26, 2, FALSE),
('Grace Lee', 'grace.lee@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 29, 2, FALSE),
('Henry Scott', 'henry.scott@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 21, 2, FALSE),
('Ivy King', 'ivy.king@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 23, 2, FALSE),
('Jack Wilson', 'jack.wilson@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 20, 2, FALSE),
('Karen Moore', 'karen.moore@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 31, 2, FALSE),
('Leo Thomas', 'leo.thomas@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 32, 2, FALSE),
('Mia Anderson', 'mia.anderson@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 28, 2, FALSE),
('Nathan Young', 'nathan.young@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 33, 2, FALSE),
('Olivia Martinez', 'olivia.martinez@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 34, 2, FALSE),
('Paul Lewis', 'paul.lewis@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 29, 2, FALSE),
('Quinn Hill', 'quinn.hill@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 27, 2, FALSE),
('Rachel Baker', 'rachel.baker@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 25, 2, FALSE);

-------------- update username cho tk admin id=1 -----
UPDATE users
SET user_name = 'congbui' WHERE user_id = 1;


				-- 2.1. Fake data cho bảng users (20 users)
				INSERT INTO users (full_name, email, password, age, avatar, role_id, is_deleted) VALUES
				('Công Bùi', 'cong@gmail.com', '123', 40, 'avatar0.jpg', 1, FALSE),
				('John Doe', 'john.doe@example.com', 'password123', 25, 'avatar1.jpg', 2, FALSE),
				('Jane Smith', 'jane.smith@example.com', 'password123', 28, 'avatar2.jpg', 2, FALSE),
				('Alice Johnson', 'alice.johnson@example.com', 'password123', 22, 'avatar3.jpg', 2, FALSE),
				('Bob Brown', 'bob.brown@example.com', 'password123', 30, 'avatar4.jpg', 2, FALSE),
				('Charlie Davis', 'charlie.davis@example.com', 'password123', 35, 'avatar5.jpg', 2, FALSE),
				('Daniel Evans', 'daniel.evans@example.com', 'password123', 27, 'avatar6.jpg', 2, FALSE),
				('Emily White', 'emily.white@example.com', 'password123', 24, 'avatar7.jpg', 2, FALSE),
				('Frank Harris', 'frank.harris@example.com', 'password123', 26, 'avatar8.jpg', 2, FALSE),
				('Grace Lee', 'grace.lee@example.com', 'password123', 29, 'avatar9.jpg', 2, FALSE),
				('Henry Scott', 'henry.scott@example.com', 'password123', 21, 'avatar10.jpg', 2, FALSE),
				('Ivy King', 'ivy.king@example.com', 'password123', 23, 'avatar11.jpg', 2, FALSE),
				('Jack Wilson', 'jack.wilson@example.com', 'password123', 20, 'avatar12.jpg', 2, FALSE),
				('Karen Moore', 'karen.moore@example.com', 'password123', 31, 'avatar13.jpg', 2, FALSE),
				('Leo Thomas', 'leo.thomas@example.com', 'password123', 32, 'avatar14.jpg', 2, FALSE),
				('Mia Anderson', 'mia.anderson@example.com', 'password123', 28, 'avatar15.jpg', 2, FALSE),
				('Nathan Young', 'nathan.young@example.com', 'password123', 33, 'avatar16.jpg', 2, FALSE),
				('Olivia Martinez', 'olivia.martinez@example.com', 'password123', 34, 'avatar17.jpg', 2, FALSE),
				('Paul Lewis', 'paul.lewis@example.com', 'password123', 29, 'avatar18.jpg', 2, FALSE),
				('Quinn Hill', 'quinn.hill@example.com', 'password123', 27, 'avatar19.jpg', 2, FALSE),
				('Rachel Baker', 'rachel.baker@example.com', 'password123', 25, 'avatar20.jpg', 2, FALSE);
				

-- 2.2. Fake data cho bảng tags (15 tags)
INSERT IGNORE INTO tags (tag_name) VALUES
('Nature'),
('Technology'),
('Art'),
('Travel'),
('Food'),
('Fashion'),
('Sports'),
('Music'),
('Animals'),
('Cars'),
('Fitness'),
('Photography'),
('Science'),
('Education'),
('Health');

-- 2.3. Fake data cho bảng pictures
INSERT INTO pictures (pic_name, pic_url, pic_description, user_id, is_deleted) VALUES
('Sunset Beach', 'sunset_beach.jpg', 'A beautiful sunset at the beach.', 1, FALSE),
('Mountain Hike', 'mountain_hike.jpg', 'A challenging mountain trail.', 2, FALSE),
('City Lights', 'city_lights.jpg', 'Night view of the city skyline.', 3, FALSE),
('Delicious Pasta', 'delicious_pasta.jpg', 'Homemade Italian pasta.', 4, FALSE),
('Forest Walk', 'forest_walk.jpg', 'A peaceful walk in the forest.', 5, FALSE),
('Hình ảnh Nội thất đẹp cho văn phòng', 'noi-that-van-phong.jpg', 'Văn phòng với thiết kế màu trắng be, giúp toát lên vẻ tinh tế cùng với nội thất màu đen tạo điểm nhấn nhá cho văn phòng không nhàm chán', 5, FALSE),
('hình Thiên nhiên đẹp hùng vĩ - city', 'thien0nhien.jpg', 'Khung cảnh thiên nhiên hùng vĩ quá đẹp', 5, FALSE);

-- 2.4. Fake data cho bảng comments
INSERT INTO comments (user_id, pic_id, comment_date, comment_content) VALUES
(1, 1, '2024-12-12 10:00:00', 'Great picture, love the colors!'),
(2, 1, '2024-12-12 10:05:00', 'Amazing shot, well done!'),
(3, 2, '2024-12-11 15:30:00', 'Beautiful scenery, where is this?'),
(4, 2, '2024-12-11 16:00:00', 'Wow, I wish I were there!'),
(5, 3, '2024-12-10 12:45:00', 'Fantastic capture!'),
(6, 4, '2024-12-09 09:15:00', 'The lighting here is perfect.'),
(7, 4, '2024-12-09 09:30:00', 'Great focus on the subject.'),
(8, 5, '2024-12-08 14:20:00', 'Looks so peaceful and serene.'),
(9, 6, '2024-12-07 18:40:00', 'Absolutely stunning work!'),
(10, 7, '2024-12-06 20:10:00', 'Can’t stop looking at this!'),
(3, 7, '2024-12-06 20:15:00', 'What camera did you use?');

-- 2.5. Fake data cho bảng pictures_tags
INSERT INTO pictures_tags (pic_id, tag_id) VALUES
(1, 1),
(1, 4),
(2, 4),
(2, 13),
(3, 2),
(3, 6),
(4, 5),
(4, 11),
(5, 1),
(5, 14),
(6, 3),
(6, 10),
(7, 8),
(7, 12);

-- 2.6. Fake data cho bảng save_picture
INSERT INTO save_picture (user_id, pic_id, save_date) VALUES
(1, 1, '2024-12-12 11:00:00'),
(2, 2, '2024-12-11 16:30:00'),
(3, 3, '2024-12-10 13:00:00'),
(3, 4, '2024-12-09 10:00:00'),
(3, 5, '2024-12-08 15:00:00'),
(6, 6, '2024-12-07 19:00:00'),
(8, 7, '2024-12-06 21:00:00'),
(8, 1, '2024-12-12 12:00:00'),
(8, 2, '2024-12-11 17:00:00'),
(10, 3, '2024-12-10 14:00:00');






-- **************************************************************************
-- ***************** CÁC QUERY ĐỂ QUẢN LÝ, BẢO TRÌ DATABASE *****************
-- **************************************************************************

-------Cập nhật thêm các trường user_name, first/last_name...
UPDATE users
SET first_name = SUBSTRING(full_name, 1, LOCATE(' ', full_name) - 1),
    last_name = SUBSTRING(full_name, LOCATE(' ', full_name) + 1);
    
-- update có check case full_name ko có khoảng trắng -> first_name = full_name | last_name = null
UPDATE users
SET first_name = IF(LOCATE(' ', full_name) > 0, SUBSTRING(full_name, 1, LOCATE(' ', full_name) - 1), full_name),
    last_name = IF(LOCATE(' ', full_name) > 0, SUBSTRING(full_name, LOCATE(' ', full_name) + 1), NULL);
    
-- Tạo full_name nối từ first_năm + last_name
UPDATE users
SET full_name = CONCAT(first_name, '-', last_name);
    
-- tạo user_name: nối từ first_name, last_name
UPDATE users
SET user_name = LOWER(CONCAT(first_name, '-', last_name));

		-- có xét rỗng ------
		UPDATE users
		SET user_name = LOWER(IF( (first_name IS NULL OR TRIM(first_name) = '') AND (last_name IS NULL OR TRIM(last_name) = '') , CONCAT('user-', user_id),
									IF(first_name IS NULL OR TRIM(first_name)='', CONCAT(last_name, '-', user_id),
							   		 IF(last_name IS NULL OR TRIM(last_name)='', CONCAT(first_name, '-', user_id),
								     	CONCAT(first_name, '-', last_name)
							) ) ) );

-- tạo user_name: từ full_name
UPDATE users
SET user_name = LOWER(REPLACE(full_name,' ','-'));


-- xóa dữ liệu từng cột
UPDATE users
SET user_name = NULL;

UPDATE users
SET first_name = NULL,
	last_name = NULL;

UPDATE users
SET full_name = NULL;

UPDATE users
SET avatar = NULL,
	user_bio = NULL,
	user_web = NULL;

---------------------------------- Tạo Stored Procedure: remove dấu tiếng việt (chạy 1 lần để tạo Function) ---------------------------
DELIMITER $$

CREATE PROCEDURE RemoveVietnameseDiacritics()
BEGIN
    UPDATE users
    SET user_name = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(user_name, 'à', 'a'), 'á', 'a'), 'ạ', 'a'), 
                    'ả', 'a'), 'ã', 'a'), 'â', 'a'), 'ầ', 'a'),
                    'ấ', 'a'), 'ậ', 'a'), 'ẩ', 'a'), 'ẫ', 'a'),
                    'ă', 'a'), 'ằ', 'a'), 'ắ', 'a'), 'ặ', 'a'),
                    'ẳ', 'a'), 'ẵ', 'a'), 'è', 'e'), 'é', 'e'),
                    'ẹ', 'e'), 'ẻ', 'e'), 'ẽ', 'e'), 'ê', 'e'),
                    'ề', 'e'), 'ế', 'e'), 'ệ', 'e'), 'ể', 'e'),
                    'ễ', 'e'), 'ì', 'i'), 'í', 'i'), 'ị', 'i'),
                    'ỉ', 'i'), 'ĩ', 'i'), 'ò', 'o'), 'ó', 'o'),
                    'ọ', 'o'), 'ỏ', 'o'), 'õ', 'o'), 'ô', 'o'),
                    'ồ', 'o'), 'ố', 'o'), 'ộ', 'o'), 'ổ', 'o'),
                    'ỗ', 'o'), 'ơ', 'o'), 'ờ', 'o'), 'ớ', 'o'),
                    'ợ', 'o'), 'ở', 'o'), 'ỡ', 'o'), 'ù', 'u'),
                    'ú', 'u'), 'ụ', 'u'), 'ủ', 'u'), 'ũ', 'u'),
                    'ư', 'u'), 'ừ', 'u'), 'ứ', 'u'), 'ự', 'u'),
                    'ử', 'u'), 'ữ', 'u'), 'ỳ', 'y'), 'ý', 'y'),
                    'ỵ', 'y'), 'ỷ', 'y'), 'ỹ', 'y'), 'đ', 'd');
END$$

DELIMITER ;
--- END Stored Procedure -------

------Chạy Hàm Stored Procedure -----
CALL RemoveVietnameseDiacritics();


-- TẠO EVENT ĐỊNH KỲ ĐỂ TỰ ĐỘNG XÓA BẢNG GHI CÓ TRẠNG THÁI is_deleted = true SAU ?? NGÀY
-- kiểm tra Event Scheduler đã bật chưa
SHOW VARIABLES LIKE 'event_scheduler';
-- nếu chưa bật -> bật
SET GLOBAL event_scheduler = ON;

-- Tạo event: xóa user có trạng thái is_deleted = TRUE quá 30 ngày
CREATE EVENT IF NOT EXISTS delete_old_users
ON SCHEDULE EVERY 1 DAY -- Chạy mỗi ngày một lần
STARTS CURRENT_TIMESTAMP -- Bắt đầu từ thời điểm hiện tại
DO
BEGIN
    DELETE FROM users
    WHERE is_deleted = TRUE
      AND updated_at < NOW() - INTERVAL 30 DAY;
END;

-- kiểm tra event đã được tạo chưa
SHOW EVENTS;

-- xóa event
DROP EVENT IF EXISTS delete_old_users;





