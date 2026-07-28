import { useState } from "react";
import api from "../services/api";

function AdicionarDespesa({ onAdicionado }) {
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [carregar, setCarregar] = useState(false);
    const [erro, setErro] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        setCarregar(true);
        try {
            await api.post('/despesas', { nome, valor: parseFloat(valor) });
            setNome('');
            setValor('');
            onAdicionado();
        } catch(err) {
            setErro(err.response?.data?.mensagem || "Erro ao adicionar despesa.");
        } finally {
            setCarregar(false);
        }
    }

    return (
        <div>
            <h3 className="text-2xl font-bold text-center mb-6">Adicionar Despesa</h3>
            {erro && <p className="text-red-500 text-sm mb-2">{erro}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)}
                className="border border-gray-300 p-1 focus:outline-none w-full"/>
                <input type="number" placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)}
                className="border border-gray-300 p-1 my-4 focus:outline-none w-full"/>
            <div className="flex justify-center">
                <button type="submit" disabled={carregar}
                className="bg-blue-500 text-white font-bold py-2 px-3 
                rounded hover:bg-blue-600 cursor-pointer">{carregar ? 'Adicionando' : 'Adicionar'}</button>
            </div>
            </form>
        </div>
    );
}

export default AdicionarDespesa;