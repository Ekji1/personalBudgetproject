import api from "../services/api";

function DeletarItem({ tipo, id, onDeletado }) {

    async function handleDeletar() {
        try {
            await api.delete(`${tipo}/${id}`);
            window.confirm('Deseja deletar?');
            onDeletado();
        } catch(err) {
            alert(err.response?.data?.mensagem || 'Erro ao deletar');
        }
    }

    return (
        <button onClick={handleDeletar} className="text-red-500 hover:underline px-2">Deletar</button>
    );
}

export default DeletarItem;