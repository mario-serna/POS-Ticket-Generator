/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import PrintIcon from "@mui/icons-material/Print";
import Button from "@mui/material/Button";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

const TicketContainer = styled.div`
  width: fit-content;
  margin: 0 auto;
  border-radius: 8px;
  background: white;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;

  @media print {
    border: none;
    box-shadow: none;
    max-width: 100%;
    padding: 0;

    /* Hide the print button when printing */
    .print-button {
      display: none;
    }
  }
`;

// Print button styles
const PrintButton = styled(Button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

// Print-specific styles
const printStyles = `
  @page { 
    size: 80mm auto;
    margin: 5mm;
  }
  body { 
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-family: Arial, sans-serif;
  }
  @media print {
    @page { 
      size: 80mm auto;
      margin: 0;
    }
    body { 
      margin: 0;
      padding: 1rem;
    }
  }

  p {
    margin: 0;
  }
`;

export const TicketPreview = ({
  fields,
  products,
  subtotal,
  tax,
  total,
  storeInfo,
}) => {
  console.log(fields, products, subtotal, tax, total);
  const printContentRef = useRef(null);
  const [rawHTML, setRawHTML] = useState("");
  const [previewHTML, setPreviewHTML] = useState("");

  const generateRawHTML = () => {
    let content = `
  <div style="${storeInfo?.ticketStyle || ""}">
      <div>
        ${storeInfo.contentHeader}
      </div>
                  
      <div style="margin-bottom: 1rem; border-top: 1px solid #eee; padding-top: 0.5rem; font-size: 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
            ${
              storeInfo?.productsTable?.name
                ? `<th style="max-width: 100px; text-align: left; padding: 0.25rem 0; border-bottom: 1px solid #eee;">
                  Producto
                </th>`
                : ""
            }
            ${
              storeInfo?.productsTable?.quantity
                ? `<th style="text-align: right; padding: 0.25rem 0; border-bottom: 1px solid #eee;">
                  Cantidad
                </th>`
                : ""
            }
            ${
              storeInfo?.productsTable?.price
                ? `<th style="text-align: right; padding: 0.25rem 0; border-bottom: 1px solid #eee;">
                  Precio
                </th>`
                : ""
            }
            ${
              storeInfo?.productsTable?.total
                ? `<th style="text-align: right; padding: 0.25rem 0; border-bottom: 1px solid #eee;">
                  Total
                </th>`
                : ""
            }
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (product) => `
              <tr>
                ${
                  storeInfo?.productsTable?.name
                    ? `<td style="max-width: 100px; padding: 0.25rem 0; border-bottom: 1px solid #f5f5f5;">${
                        product.name || "Item"
                      }</td>`
                    : ""
                }
                ${
                  storeInfo?.productsTable?.quantity
                    ? `<td style="text-align: right; padding: 0.25rem 0; border-bottom: 1px solid #f5f5f5;">${
                        product.quantity || 0
                      }</td>`
                    : ""
                }
                ${
                  storeInfo?.productsTable?.price
                    ? `<td style="text-align: right; padding: 0.25rem 0; border-bottom: 1px solid #f5f5f5;">$${(
                        product.price || 0
                      ).toFixed(2)}</td>`
                    : ""
                }
                ${
                  storeInfo?.productsTable?.total
                    ? `<td style="text-align: right; padding: 0.25rem 0; border-bottom: 1px solid #f5f5f5;">$${(
                        (product.price || 0) * (product.quantity || 0)
                      ).toFixed(2)}</td>`
                    : ""
                }
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
      
      <div style="padding-top: 0.5rem; padding-bottom: 0.5rem; border-top: 1px dashed #ddd; border-bottom: 1px dashed #ddd; font-size: 10px;">
        ${
          storeInfo.tax.hide
            ? ""
            : `
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <span>Subtotal:</span>
                <span>$${(subtotal || 0).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;">
                <span>IVA (${tax?.rate || 0}%):</span>
                <span>$${(tax?.amount || 0).toFixed(2)}</span>
              </div>
          `
        }
        <div style="display: flex; justify-content: space-between; font-weight: bold; padding-top: 0.5rem;">
          <span>Total:</span>
          <span>$${(total || 0).toFixed(2)}</span>
        </div>
      </div>
      
      <div style="padding-top: 0.5rem;">
        <p style="margin: 0; text-align: center; font-size: 10px;">${format(
          new Date(),
          "yyyy-MM-dd HH:mm:ss"
        )}</p>
        ${storeInfo.contentFooter}
      </div>
    </div>`;

    if (fields.length) {
      fields.forEach((field) => {
        console.log("replace", field);
        content = content.replace(field.key, field.value);
      });
    }

    // Get the ticket HTML content
    const ticketContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Receipt</title>
      <style>${printStyles}</style>
    </head>
    <body>
      ${content}
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          }, 500);
        };
      </script>
    </body>
  </html>
`;

    setRawHTML(ticketContent);
    setPreviewHTML(content);
  };

  useEffect(() => {
    generateRawHTML();
  }, [fields, products, subtotal, tax, total, storeInfo]);

  const handlePrint = () => {
    const printWindow = window.open("", "_PRINT", "height=600,width=800");

    if (!printWindow) {
      alert("Popup was blocked. Please allow popups for this site.");
      return;
    }

    // Write the content to the new window
    printWindow.document.open();
    printWindow.document.write(rawHTML);
    printWindow.document.close();
  };
  return (
    <>
      <PrintButton
        variant="contained"
        color="primary"
        startIcon={<PrintIcon />}
        onClick={handlePrint}
        className="print-button"
      >
        Imprimir Ticket
      </PrintButton>

      <TicketContainer
        ref={printContentRef}
        dangerouslySetInnerHTML={{ __html: previewHTML }}
      ></TicketContainer>
    </>
  );
};
