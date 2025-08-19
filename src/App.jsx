import styled from "@emotion/styled";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { CustomTabPanel, CustomTabs } from "./components/CustomTabs";
import { FieldList } from "./components/Fields/FieldList";
import { InputFieldList } from "./components/Fields/InputFieldList";
import { ProductList } from "./components/ProductList";
import { TicketPreview } from "./components/TicketPreview";
import { Tinymce } from "./components/Tinymce";
import { useAppContext } from "./context/app.context";
import { useTabsContext } from "./context/tabs.context";

const AppContainer = styled.div`
  margin: 0 auto;
  padding: 2rem;
  font-family: "Arial", sans-serif;
`;

const Header = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #444;
  margin-top: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
`;

const SaveButton = styled(Button)`
  position: fixed;
  bottom: 2rem;
  right: 14rem;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

function App() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const [storeInfo, setStoreInfo] = useState({
    contentHeader: "",
    contentFooter: "",
    tax: {
      rate: 10,
      hide: false,
    },
  });

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState({ amount: 0, rate: 0, hide: false });
  const [total, setTotal] = useState(0);
  const [fields, setFields] = useState([]);

  const { getConfigData, saveConfigData } = useAppContext();
  const { value } = useTabsContext();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getConfigData();
      console.log(data);
      if (data) {
        setStoreInfo((prev) => ({ ...prev, ...data }));
        setFields(data.fields);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    updateTotals();
  }, [products]);

  const updateField = (id, updates, softUpdate = false) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
    if (!softUpdate) {
      setStoreInfo({ ...storeInfo, fields: updatedFields });
    }
    console.log(updates);
  };

  const updateTotals = () => {
    const subtotal = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const tax = storeInfo.tax.hide
      ? 0
      : subtotal * ((storeInfo.tax.rate || 0) / 100); // 10% tax
    const total = storeInfo.tax.hide ? subtotal : subtotal + tax;

    setSubtotal(subtotal);
    setTax({
      amount: tax,
      rate: storeInfo.tax.rate,
      hide: storeInfo.tax.hide,
    });
    setTotal(total);
  };

  const addProduct = (product) => {
    setProducts([...products, { ...product, id: Date.now() }]);
  };

  const updateProduct = (id, updates) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const removeProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleSave = async () => {
    const result = await saveConfigData(storeInfo);
    setOpenNotification(true);
    setNotificationMessage(result.data);
  };

  return (
    <>
      <AppContainer>
        <Header>POS Ticket Generator</Header>
        <Content>
          <SaveButton
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Guardar configuración
          </SaveButton>
          <CustomTabs>
            <CustomTabPanel value={value} index={0}>
              {fields.length > 0 && (
                <Section style={{ marginBottom: "1rem" }}>
                  <SectionTitle>Campos</SectionTitle>
                  <InputFieldList
                    fields={fields}
                    onUpdate={updateField}
                    softUpdate
                  />
                </Section>
              )}
              <Section>
                <SectionTitle>Productos</SectionTitle>
                <ProductList
                  products={products}
                  onAdd={addProduct}
                  onUpdate={updateProduct}
                  onRemove={removeProduct}
                />
              </Section>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Section>
                <SectionTitle>Campos</SectionTitle>
                <FieldList
                  fields={fields}
                  setFields={setFields}
                  onUpdate={updateField}
                />
              </Section>
              <Section>
                <SectionTitle>Encabezado</SectionTitle>
                <div style={{ marginBottom: "1.5rem" }}>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <Tinymce
                      content={storeInfo.contentHeader}
                      onChange={(html) => {
                        setStoreInfo({ ...storeInfo, contentHeader: html });
                      }}
                    />
                  )}
                </div>
                <SectionTitle>Pie de página</SectionTitle>
                <div style={{ marginBottom: "1.5rem" }}>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <Tinymce
                      content={storeInfo.contentFooter}
                      onChange={(html) => {
                        setStoreInfo({ ...storeInfo, contentFooter: html });
                      }}
                    />
                  )}
                </div>
              </Section>
            </CustomTabPanel>
          </CustomTabs>

          <div style={{ marginTop: "72px" }}>
            <Section>
              <SectionTitle>Ticket</SectionTitle>
              <TicketPreview
                fields={fields}
                products={products}
                subtotal={subtotal}
                tax={tax}
                total={total}
                storeInfo={storeInfo}
              />
            </Section>
          </div>
        </Content>
      </AppContainer>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openNotification}
        autoHideDuration={5000} // Auto-hide after 5 seconds (5000 milliseconds)
        message={notificationMessage}
        onClose={() => setOpenNotification(false)}
      />
    </>
  );
}

export default App;
