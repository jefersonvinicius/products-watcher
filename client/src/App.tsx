import React, { FormEvent, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Container } from './App.styles';

function App() {
  const [url, setUrl] = useState('');
  const [scrappedProduct, setScrappedProduct] = useState(null);
  const [isScrapping, setIsScrapping] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <InputText value={url} onChange={(e) => setUrl(e.target.value)} />
        {scrappedProduct && <p>{JSON.stringify(scrappedProduct, null, 2)}</p>}
      </form>
    </Container>
  );
}

export default App;
