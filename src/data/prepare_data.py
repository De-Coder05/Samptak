import os
import shutil
import random
import glob

def prepare_data():
    base_dir = "data"
    raw_dir = os.path.join(base_dir, "raw")
    processed_dir = os.path.join(base_dir, "processed")
    
    # Define splits
    splits = ['train', 'validation', 'test']
    classes = ['Faulty', 'Normal']
    
    # Create directories
    for split in splits:
        for cls in classes:
            os.makedirs(os.path.join(processed_dir, split, cls), exist_ok=True)
            
    # Get all images
    # Supports jpg, jpeg, png, gif
    extensions = ['*.jpg', '*.jpeg', '*.png', '*.gif', '*.JPG', '*.JPEG', '*.PNG']
    all_files = []
    for ext in extensions:
        all_files.extend(glob.glob(os.path.join(raw_dir, ext)))
        
    print(f"Found {len(all_files)} images in {raw_dir}")
    
    # Separate by class based on filename
    faulty_images = [f for f in all_files if 'cracked' in os.path.basename(f).lower()]
    normal_images = [f for f in all_files if 'normal' in os.path.basename(f).lower()]
    
    print(f"Faulty images: {len(faulty_images)}")
    print(f"Normal images: {len(normal_images)}")
    
    # Shuffle
    random.seed(42)
    random.shuffle(faulty_images)
    random.shuffle(normal_images)
    
    # Split ratios
    train_ratio = 0.7
    val_ratio = 0.15
    # test_ratio = 0.15 (remaining)
    
    def split_and_copy(images, class_name):
        n = len(images)
        n_train = int(n * train_ratio)
        n_val = int(n * val_ratio)
        
        train_imgs = images[:n_train]
        val_imgs = images[n_train:n_train+n_val]
        test_imgs = images[n_train+n_val:]
        
        for img in train_imgs:
            shutil.copy(img, os.path.join(processed_dir, 'train', class_name, os.path.basename(img)))
            
        for img in val_imgs:
            shutil.copy(img, os.path.join(processed_dir, 'validation', class_name, os.path.basename(img)))
            
        for img in test_imgs:
            shutil.copy(img, os.path.join(processed_dir, 'test', class_name, os.path.basename(img)))
            
        print(f"[{class_name}] Train: {len(train_imgs)}, Val: {len(val_imgs)}, Test: {len(test_imgs)}")

    split_and_copy(faulty_images, 'Faulty')
    split_and_copy(normal_images, 'Normal')
    
    print("Data preparation complete.")

if __name__ == "__main__":
    prepare_data()
