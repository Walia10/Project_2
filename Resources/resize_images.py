import os
from PIL import Image

# 이미지가 저장된 디렉터리 경로
input_dir = 'images/'
output_dir = 'resized_images/'

# 출력 디렉터리가 없으면 생성
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 디렉터리 내 모든 파일에 대해 반복
for filename in os.listdir(input_dir):
    if filename.endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
        # 이미지 파일 경로
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)

        # 이미지 열기
        with Image.open(input_path) as img:
            # 이미지 크기 조정
            img_resized = img.resize((30, 30))
            # 크기 조정된 이미지 저장
            img_resized.save(output_path)

print("모든 이미지가 30x30 크기로 조정되었습니다.")
