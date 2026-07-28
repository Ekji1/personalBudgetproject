import { useState, useEffect } from 'react';
import api from '../services/api';
import EditarDespesa from './editarDespesas';
import DeletarItem from './deletarItens';


function ListaDespesas({ onAtualizado }) {
    const [despesas, setDespesas] = useState([]);
    const [editar, setEditar] = useState(null);
    const [erro, setErro] = useState('');
    
    useEffect(() => {
        async function buscarDespesas() {
            try {
                const { data } = await api.get('/despesas');
                setDespesas(data);
            } catch(err) {
                setErro('Erro ao buscar despesas.');
            }
        }
        buscarDespesas();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold text-center mb-6 flex justify-center">Despesas</h2>
            {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}
            {despesas.map(despesa => (
                <div key={despesa.id}>
                    <span className="text-base font-semibold px-1">{despesa.nome}</span>
                    <span className="text-base font-semibold px-1">R$ {despesa.valor}</span>
                    <button onClick={() => setEditar(despesa.id)}
                    className="text-blue-500 hover:underline px-1">Editar</button>
                    <DeletarItem tipo="despesas" id={despesa.id} onDeletado={onAtualizado} />
                    {editar === despesa.id && (
                        <EditarDespesa despesa={despesa} onEditado={() => { setEditar(null); onAtualizado(); }} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default ListaDespesas;

