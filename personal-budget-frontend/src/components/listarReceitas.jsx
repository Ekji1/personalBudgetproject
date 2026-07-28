import { useState, useEffect } from 'react';
import api from '../services/api';
import EditarReceita from './editarReceitas';
import DeletarItem from './deletarItens';


function ListaReceitas({ onAtualizado }) {
    const [receitas, setReceitas] = useState([]);
    const [editar, setEditar] = useState(null);
    const [erro, setErro] = useState('');


    useEffect(() => {
        async function buscarReceitas() {
            try {
                const { data } = await api.get('/receitas');
                setReceitas(data);
                } catch(err) {
                    setErro('Erro ao buscar receitas.');
                }
        }

        buscarReceitas();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold text-center mb-6 flex justify-center">Receitas</h2>
            {erro && <p className="text-red-500 text-sm mb-4">{erro}</p> }
            {receitas.map(receita => (
                <div key={receita.id}>
                    <span className="text-base font-semibold px-1">{receita.nome}</span>
                    <span className="text-base font-semibold px-1">R$ {receita.valor}</span>
                    <button onClick={() => setEditar(receita.id)} 
                    className="text-blue-500 hover:underline px-1">Editar</button>
                    <DeletarItem tipo="receitas" id={receita.id} onDeletado={onAtualizado} />
                    {editar === receita.id && (
                        <EditarReceita receita={receita} onEditado={() => { setEditar(null); onAtualizado(); }} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default ListaReceitas;