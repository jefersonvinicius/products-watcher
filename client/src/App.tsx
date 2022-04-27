import React, { FormEvent, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Message } from 'primereact/message';
import { Container } from './App.styles';
import { ScrapperService } from './services/scrapper';

function App() {
  const [url, setUrl] = useState('');
  const [scrappedProduct, setScrappedProduct] = useState(null);
  const [isScrapping, setIsScrapping] = useState(false);
  const [error, setError] = useState<any | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setError(null);
      setIsScrapping(true);
      const result = await ScrapperService.scrap(url);
      setScrappedProduct(result);
    } catch (error) {
      setError(error);
    } finally {
      setIsScrapping(false);
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <InputText value={url} onChange={(e) => setUrl(e.target.value)} />
        {isScrapping && <ProgressBar mode="indeterminate" />}
        {scrappedProduct && <p>{JSON.stringify(scrappedProduct, null, 2)}</p>}
        {error && (
          <Message severity="error" text={error?.message ?? 'Algo de errado aconteceu! Tente novamente mais tarde!'} />
        )}
      </form>
    </Container>
  );
}

export default App;
