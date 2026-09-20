// const handleFileChange = (event) => {
//   const newFiles = Array.from(event.target.files);
//   setuploadedFiles((prevFiles) => {
//     const uniqueFiles = newFiles.filter(
//       (file) =>
//         !prevFiles.some(
//           (f) => f.name === file.name && f.lastModified === file.lastModified
//         )
//     );
//     return [...prevFiles, ...uniqueFiles];
//   });
// };

const handleFileChange = (event, type ,{setuploadedFiles}) => {
  const newFiles = Array.from(event.target.files);

  setuploadedFiles((prev) => {
    const existingSignatures = prev[type].map(
      (f) => `${f.name}-${f.size}-${f.lastModified}`
    );

    const uniqueFiles = newFiles.filter((file) => {
      const signature = `${file.name}-${file.size}-${file.lastModified}`;
      return !existingSignatures.includes(signature);
    });

    if (uniqueFiles.length > 0) {
      const newFiles = {...prev};
      uniqueFiles.forEach((file,idx) => {
        newFiles[type] = [...newFiles[type] , {name:file.name , file}];
      })
      return newFiles;
    } else {
      return prev; // no change
    }
  });

  event.target.value = null; // Reset input for re-selection
};

