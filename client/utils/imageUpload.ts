export const convertImage = (image: File): FormData => {
  const formData = new FormData();
  const blob = new Blob([image], { type: "image" });
  formData.append("image", blob, image.name);
  return formData;
};
