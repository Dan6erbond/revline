package internal

import (
	"bytes"
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"net/http"
)

var ErrUnsupportedFileFormat = errors.New("unsupported file format")

func ParseImage(imageBytes []byte) (image.Image, error) {
	contentType := http.DetectContentType(imageBytes)

	switch contentType {
	case "image/png":
		return png.Decode(bytes.NewReader(imageBytes))
	case "image/jpeg":
		return jpeg.Decode(bytes.NewReader(imageBytes))
	default:
		return nil, ErrUnsupportedFileFormat
	}
}

func ToPng(img image.Image) (*bytes.Buffer, *int64, error) {
	buf := new(bytes.Buffer)

	if err := png.Encode(buf, img); err != nil {
		return nil, nil, fmt.Errorf("unable to encode png %w", err)
	}

	size := int64(len(buf.Bytes()))

	return buf, &size, nil
}
