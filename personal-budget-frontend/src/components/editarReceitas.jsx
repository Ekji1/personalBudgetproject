import { useState } from "react";
import api from "../services/api";

function EditarReceita({ receita, onEditado }) {
    const [nome, setNome] = useState(receita.nome);
    const [valor, setValor] = useState(receita.valor);
    const [erro, setErro] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.put(`/receitas/${receita.id}`, { nome, valor: parseFloat(valor) });
            onEditado();
        } catch(err) {
            setErro(err.response?.data?.mensagem || 'Erro ao editar receita.');
        }
    }

    return (
        <div>
            <hr class="my-4 border-t border-gray-300" />
                <h3 className="text-lg font-bold text-center mb-6">Editar Receitas</h3>
                {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} 
                    className="w-32 border border-gray-300 p-2 focus:outline-none mr-2"/>
                    <input type="number" value={valor} onChange={e => setValor(e.target.value)} 
                    className="w-32 border border-gray-300 p-2 focus:outline-none mr-2"/>
                    <button type="submit" className="text-blue-500 hover:underline">Salvar</button>
                </form>
        </div>
    );
}

export default EditarReceita;