import { Dispatch, FC, DragEvent, SetStateAction } from 'react';
import { ImageInfo, UpdateCanvas, ReadAlpha, TextConversion } from './types';

interface ImageUploaderProps {
  updateCanvas: UpdateCanvas,
  imageInfo: ImageInfo,
  setImageInfo: Dispatch<SetStateAction<ImageInfo>>,
  readAlpha: ReadAlpha,
  textToBinary: TextConversion,
}

const ImageUploader: FC<ImageUploaderProps> = props => {
  const { updateCanvas, imageInfo, setImageInfo, readAlpha, textToBinary } = props;

  const uploadImage = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const fr = new FileReader();
    const img = new Image();

    // Only accept png images and only use the first file if several are dragged.
    const file = e.dataTransfer.files[0];

    if (file.type === 'image/png') {
      fr.readAsDataURL(file);
    } else {
      // TODO: Set up a mechanism for reporting errors to the user
      console.log('Invalid format. Use a PNG image.');
    }

    fr.onload = event => {
      try {
        img.onload = () => {
          updateCanvas(img);
          setImageInfo({
            ...imageInfo,
            image: img,
            name: file.name,
            text: readAlpha() || '',
            binary: textToBinary(readAlpha() || ''),
          });
        };
        // TODO: This seems like a bad way of doing things. Sesearch further.
        img.src = event?.target ? event.target.result as string : '';
      } catch (err) {
        // TODO: Set up a mechanism for reporting errors to the user
        console.log('File failed to load.');
      }
    };
  };

  return (
    <div
      className="ImageUploader"
      onDrop={uploadImage}
      onDragEnter={e => e.preventDefault()}
      onDragOver={e => e.preventDefault()}
    >
      {
      imageInfo.image
        ? (
          <img
            className="ImagePreview"
            src={imageInfo.image.src}
            alt="thumbnail"
          />
        ) : (
          <span>drag an image file here</span>
        )
      }
    </div>
  );
};

export default ImageUploader;
