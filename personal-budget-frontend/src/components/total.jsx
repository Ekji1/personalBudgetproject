import { useState, useEffect } from "react";
import api from "../services/api";
 
function Total() {

    const [total, setTotal ] = useState(null);
    const [erro, setErro] = useState('');
    const cores = {
    positivo: 'text-green-400',
    negativo: 'text-red-400',
    zero: 'text-gray-700'
    };

    useEffect(() => {
    
        async function buscarTotal() {
            try {
                const { data } = await api.get('/total');
                setTotal(data);
            } catch(err) {
                setErro('Erro ao buscar total.');
            }
        }
        buscarTotal();
    }, []);

    function corSaldo(saldo) {
        if(saldo > 0) {
            return cores.positivo;
        } else if(saldo < 0) {
            return cores.negativo;
        } else {
            return cores.zero;
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-center mb-6">Total</h2>
            {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}
                {total && (
                <div>
                    <p className="text-lg font-semibold text-green-400 p-2 px-3">Total Receitas: R$ {total.totalReceitas}</p>
                    <p className="text-lg font-semibold text-red-400 p-2 px-3">Total Despesas: R$ {total.totalDespesas}</p>
                    <p className={`text-lg font-semibold p-2 px-3  ${corSaldo(total.saldo)}`}>Saldo: R$ {total.saldo}</p>
                </div>
            )}
        </div>
    );
}

export default Total;