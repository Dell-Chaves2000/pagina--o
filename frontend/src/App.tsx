import { useEffect, useState } from 'react';
import './App.css';

interface Livro {
  _id: string;
  titulo: string;
  autor: string;
  isbn: string;
  paginas: number;
  ano: number;
  valor: number;
}

function App() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [pageTotal, setPageTotal] = useState(0);
  const [amount, setAmount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      await getAmount();
      getLivros(page);
    }
    fetchData();

  }, [page]);

  async function getLivros(page: number) {
    try {
      const response = await fetch(`http://localhost:3001/livros/${page}`);
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        setLivros(data);
      } else {
        setLivros([]);
      }
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    }
  }

  async function getAmount() {
    try {
      const response = await fetch(`http://localhost:3001/len`);
      if (response.ok) {
        const data = await response.json();
        setAmount(data.amount);
        countPages(data.amount);
      } else {
        setAmount(0);
      }
    } catch (error) {
      console.error("Erro ao contar paginas:", error);
    }
  }

  function countPages(amount: number) {
    const numberOfPages = Math.ceil(amount / 10);
    setPageTotal(numberOfPages);
  }

  function handlePage(value: number) {
    setPage(value);
  }

  function renderPageNumbers() {
    const totalPagesToShow = Math.min(pageTotal, 7);
    const pageNumbers = [];
    const startPage = Math.max(1, page - Math.floor(totalPagesToShow / 2));
    const endPage = Math.min(pageTotal, startPage + totalPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button key={i} onClick={() => handlePage(i)} style={{ backgroundColor: i === page ? 'blue' : '' }}>
          {i}
        </button>
      );
    }

    return pageNumbers;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lista de livros livraria</h1>
        <table>
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Autor</th>
              <th>ISBN</th>
              <th>Páginas</th>
              <th>Ano</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {livros.map((livro: Livro) => (
              <tr key={livro._id}>
                <td>{livro.titulo}</td>
                <td>{livro.autor}</td>
                <td>{livro.isbn}</td>
                <td>{livro.paginas}</td>
                <td>{livro.ano}</td>
                <td>{livro.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          {pageTotal > 0 && (
            <div>
              Exibindo de {((page - 1) * 10) + 1} até {(page * 10 > amount) ? amount : (page * 10)} de {amount} livros
            </div>
          )}
          <button disabled={page <= 1} onClick={() => setPage(1)}>{'<<'}</button>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>{'<'}</button>
          {renderPageNumbers()}
          <button disabled={page >= pageTotal} onClick={() => setPage(page + 1)}>{'>'}</button>
          <button disabled={page >= pageTotal} onClick={() => setPage(pageTotal)}>{'>>'}</button>
        </div>
      </header>
    </div>
  );
}

export default App;
