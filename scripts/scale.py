from PIL import Image

def scale_image(input_image, output_image, scale):
    image = Image.open(input_image)
    
    width = int(image.width * scale)
    height = int(image.height * scale)
    
    resized_image = image.resize((width, height), Image.LANCZOS)
    resized_image.save(output_image)
        

input_file = "logo.png"
scale_factor = 0.25
output_file = f"logo-{scale_factor}x.png"


scale_image(input_file, output_file, scale_factor)
