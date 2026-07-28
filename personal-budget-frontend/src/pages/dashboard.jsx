import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import ListaReceitas from '../components/listarReceitas';
import ListaDespesas from '../components/listarDespesas';
import AdicionarReceita from '../components/adicionarReceitas';
import AdicionarDespesa from '../components/adicionarDespesas';
import Total from '../components/total';

function Dashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [atualizar, setAtualizar] = useState(0);

    function handleLogout() {
        logout();
        navigate('/login');
    }

    const recarregar = useCallback(() => {
        setAtualizar(a => a + 1);
    }, []); 

    return (
    <div className="min-h-screen bg-blue-400 flex flex-col shadow-lg">
        <div className="flex justify-between items-center px-8 py-4 bg-white ">
            <h1 className="text-3xl font-bold"> Personal Budget</h1>
            <button onClick={handleLogout} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 cursor-pointer">Sair</button>
        </div>
        <div className="flex justify-center items-start gap-10 p-10">
            <div className="bg-white p-5 rounded-lg shadow-md w-80 min-h-150 ">
                <AdicionarReceita onAdicionado={recarregar} />
                <hr class="my-4 border-t border-gray-300" />
                <ListaReceitas key={`r-${atualizar}`} onAtualizado={recarregar} />
            </div>
            <div className="bg-white p-5 rounded-lg shadow-lg w-80 min-h-150 ">
                <AdicionarDespesa onAdicionado={recarregar} />
                <hr class="my-4 border-t border-gray-300" />
                <ListaDespesas key={`d-${atualizar}`} onAtualizado={recarregar} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 min-h-150 ">
                <Total key={atualizar} />
            </div>
        </div>
    </div>
    );
}

export default Dashboard;