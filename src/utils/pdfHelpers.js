import { PDFDocument } from 'pdf-lib';

/**
 * Merges multiple PDF and Image files into a single PDF.
 * @param {File[]} files - Array of File objects (PDFs or Images).
 * @returns {Promise<Uint8Array>} - The merged PDF as a byte array.
 */
export async function mergeDocuments(files) {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const extension = file.name.split('.').pop().toLowerCase();

        if (extension === 'pdf') {
            const pdf = await PDFDocument.load(arrayBuffer);
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
            const scale = Math.min(widthRatio, heightRatio, 1); // Scale down if needed, don't scale up past original

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
    }

    const mergedPdfFile = await mergedPdf.save();
    return mergedPdfFile;
}
