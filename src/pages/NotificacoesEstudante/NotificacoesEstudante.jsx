import React, { useState, useEffect } from 'react';
import { listarTodasNoticiasEstudante, getPendencias } from '../../services/alunoService';
import BellIcon from '../../components/icons/BellIcon';
import CheckIcon from '../../components/icons/CheckIcon';
import './NotificacoesEstudante.css';

const FORMATO_TIPO = {
  leitura: 'Leitura',
  exercicio: 'Lista de Exercícios',
  trabalho: 'Trabalho',
  avaliacao: 'Avaliação',
};

export default function NotificacoesEstudante() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lidas, setLidas] = useState(() => {
    const saved = localStorage.getItem('notificacoes_lidas');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('notificacoes_lidas', JSON.stringify(lidas));
  }, [lidas]);

  useEffect(() => {
    async function carregarNotificacoes() {
      try {
        setLoading(true);
        const [pendenciasRes, comunicadosRes] = await Promise.allSettled([
          getPendencias(),
		  listarTodasNoticiasEstudante(),
        ]);

        const pendencias =
          pendenciasRes.status === 'fulfilled'
            ? (pendenciasRes.value.pendencias || []).map((item) => {
                const tipoLabel = FORMATO_TIPO[item.tipo] || item.tipo || 'Atividade';
                const situacaoLabel =
                  item.situacao === 'vencida' ? 'Vencida' : 'Pendente';

                return {
                  id: `pendencia-${item.id}`,
                  titulo: item.titulo,
                  mensagem: `Atividade do tipo ${tipoLabel} — Situação: ${situacaoLabel}.`,
                  origem: item.disciplina || 'Disciplina',
                  isDisciplina: true,
                  situacao: item.situacao,
                  data: item.prazo,
                };
              })
            : [];

        const listaComunicadosRaw =
          comunicadosRes.status === 'fulfilled'
            ? comunicadosRes.value?.comunicados || comunicadosRes.value || []
            : [];

        const comunicados = Array.isArray(listaComunicadosRaw)
          ? listaComunicadosRaw.map((com) => ({
              id: `comunicado-${com.id}`,
              titulo: com.title,
              mensagem: com.summary || '',
              origem: 'Institucional',
              isDisciplina: false,
              situacao: null,
              data: com.publicado_em,
            }))
          : [];

        const todas = [...pendencias, ...comunicados].sort(
          (a, b) => new Date(b.data) - new Date(a.data)
        );

        setNotificacoes(todas);
      } catch (err) {
        setError('Não foi possível carregar as notificações e pendências.');
      } finally {
        setLoading(false);
      }
    }

    carregarNotificacoes();
  }, []);

  const toggleMarcarComoLida = (id) => {
    setLidas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const marcarTodasComoLidas = () => {
    setLidas(notificacoes.map((n) => n.id));
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '';
    const data = new Date(dataStr);
    const temHora = dataStr.includes('T');
    return temHora
      ? data.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : data.toLocaleDateString('pt-BR');
  };

  const naoLidasCount = notificacoes.filter((n) => !lidas.includes(n.id)).length;

  if (loading) {
    return <div className="loading-container">Carregando notificações...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="notificacoes-estudante-container">
      <div className="page-header">
        <div className="header-title-wrapper">
          <BellIcon className="header-icon" />
          <div>
            <h1>Notificações e Pendências</h1>
            <p>Acompanhe suas atividades pendentes e comunicados institucionais</p>
          </div>
        </div>
        <div className="header-actions">
          <span className="badge-nao-lidas">
            {naoLidasCount} não {naoLidasCount === 1 ? 'lida' : 'lidas'}
          </span>
          {naoLidasCount > 0 && (
            <button className="btn-secondary" onClick={marcarTodasComoLidas}>
              Marcar todas como lidas
            </button>
          )}
        </div>
      </div>

      {notificacoes.length === 0 ? (
        <div className="empty-state">
          <BellIcon className="empty-icon" />
          <h3>Nenhuma notificação encontrada</h3>
          <p>Você não possui pendências ou comunicados no momento.</p>
        </div>
      ) : (
        <div className="notificacoes-list">
          {notificacoes.map((item) => {
            const isLida = lidas.includes(item.id);

            return (
              <div
                key={item.id}
                className={`notice-card ${isLida ? 'lida' : 'nao-lida'}`}
              >
                <div className="notice-header">
                  <div className="notice-badges">
                    <span
                      className={`badge-origem ${
                        item.isDisciplina ? 'disciplina' : 'institucional'
                      }`}
                    >
                      {item.origem}
                    </span>
                    {item.situacao && (
                      <span className={`badge-situacao ${item.situacao}`}>
                        {item.situacao === 'vencida' ? 'Vencida' : 'Pendente'}
                      </span>
                    )}
                  </div>
                  <span className="notice-date">
                    {item.isDisciplina ? `Prazo: ${formatarData(item.data)}` : formatarData(item.data)}
                  </span>
                </div>

                <div className="notice-content">
                  <h3>{item.titulo}</h3>
                  <p>{item.mensagem}</p>
                </div>

                <div className="notice-footer">
                  <button
                    className={`btn-toggle-read ${isLida ? 'read' : 'unread'}`}
                    onClick={() => toggleMarcarComoLida(item.id)}
                  >
                    <CheckIcon /> {isLida ? 'Marcar como não lida' : 'Marcar como lida'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
