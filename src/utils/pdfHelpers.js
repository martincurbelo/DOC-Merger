import { PDFDocument } from 'pdf-lib';

/**
 * Merges multiple PDF and Image files into a single PDF.
 * Processes files in batches to handle large numbers of files.
 * @param {File[]} files - Array of File objects (PDFs or Images).
 * @param {function} onProgress - Optional callback for progress updates.
 * @returns {Promise<Uint8Array>} - The merged PDF as a byte array.
 */
export async function mergeDocuments(files, onProgress = null) {
    const mergedPdf = await PDFDocument.create();

    // Process files one by one and release memory
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
            const arrayBuffer = await file.arrayBuffer();
            const extension = file.name.split('.').pop().toLowerCase();

            if (extension === 'pdf') {
                const pdf = await PDFDocument.load(arrayBuffer, {
                    ignoreEncryption: true
                });
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
                // Create a new A4 page
                const page = mergedPdf.addPage([595.28, 841.89]); // A4 in points
                const { width: pageWidth, height: pageHeight } = page.getSize();

                let image;
                if (extension === 'png') {
                    image = await mergedPdf.embedPng(arrayBuffer);
                } else {
                    image = await mergedPdf.embedJpg(arrayBuffer);
                }

                const imgDims = image.scale(1);

                // Calculate best fit maintaining aspect ratio
                const padding = 40;
                const maxWidth = pageWidth - padding * 2;
                const maxHeight = pageHeight - padding * 2;

                const widthRatio = maxWidth / imgDims.width;
                const heightRatio = maxHeight / imgDims.height;
                const scale = Math.min(widthRatio, heightRatio, 1);

                const finalWidth = imgDims.width * scale;
                const finalHeight = imgDims.height * scale;

                // Center the image
                page.drawImage(image, {
                    x: (pageWidth - finalWidth) / 2,
                    y: (pageHeight - finalHeight) / 2,
                    width: finalWidth,
                    height: finalHeight,
                });
            }

            // Report progress if callback provided
            if (onProgress) {
                onProgress(Math.round(((i + 1) / files.length) * 100));
            }
        } catch (err) {
            console.error(`Error processing file ${file.name}:`, err);
            throw new Error(`Failed to process "${file.name}": ${err.message}`);
        }
    }

    // Save with options to reduce memory usage
    const mergedPdfFile = await mergedPdf.save({
        useObjectStreams: false,
    });

    return mergedPdfFile;
}
