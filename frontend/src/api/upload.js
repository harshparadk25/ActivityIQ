import API  from "./axios";

export const UploadCSV = (file) =>{
    const formData = new FormData();
    formData.append("file", file);

    return API.post('/uploads', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}