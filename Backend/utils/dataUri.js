import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer).content;
};
export default getDataUri;


// import DataUriPraser from "datauri/parser.js"
// import path from "path"

// const parser = new DataUriPraser();

// const getDataUri = (file) => {
//     const extName = path.fileName(file.originalname).toString();
//     return parser.format(extName, file.buffer).content;
// };

// export default getDataUri;