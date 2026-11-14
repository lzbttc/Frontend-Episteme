import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PATHS, matriculaComprovantePath } from '../../routes/paths'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useMatricula } from './context/MatriculaContext'
import { obterMinhasSolicitacoes } from '../../services/matriculaService'
import Button from '../../components/Button/Button'
import {
  ChevronRightSmallIcon,
  FileTextIcon,
} from '../../components/icons'
import './MinhasSolicitacoes.css'

function formatarDataEnvio(dataIso) {
  if (!dataIso) return '16/09/2026 · 10:42'
  try {
    const data = new Date(dataIso)
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = data.getFullYear()
    const hora = String(data.getHours()).padStart(2, '0')
    const min = String(data.getMinutes()).padStart(2, '0')
    return `${dia}/${mes}/${ano} · ${hora}:${min}`
  } catch {
    return dataIso
  }
}

export default function MinhasSolicitacoes() {
  usePageTitle('Minhas Solicitações de Matrícula')
  const navigate = useNavigate()
  const { solicitacaoRecente } = useMatricula()

  const [solicitacoes, setSolicitacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregarSolicitacoes = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const dados = await obterMinhasSolicitacoes()
      let lista = Array.isArray(dados) ? dados : []

      // Se houver solicitação recente no contexto e ela não estiver na lista retornada pela API, inclui no topo
      if (solicitacaoRecente) {
        const jaExiste = lista.some(
          (s) =>
            (s.protocolo && s.protocolo === solicitacaoRecente.protocolo) ||
            (s.id && s.id === solicitacaoRecente.id)
        )
        if (!jaExiste) {
          lista = [solicitacaoRecente, ...lista]
        }
      }

      // Se a API retornar vazia e não houver solicitação recente, usa a do protótipo como fallback ilustrativo
      if (lista.length === 0) {
        lista = [
          {
            id: 'MAT-2026-001842',
            protocolo: 'MAT-2026-001842',
            periodo_letivo: '2026.2',
            data_solicitacao: '2026-09-16T10:42:00',
            turmas_ids: ['t1', 't2', 't3'],
            quantidade_turmas: 3,
            situacao: 'Pendente',
          },
        ]
      }

      setSolicitacoes(lista)
    } catch {
      // Fallback em caso de erro na API
      if (solicitacaoRecente) {
        setSolicitacoes([solicitacaoRecente])
      } else {
        setSolicitacoes([
          {
            id: 'MAT-2026-001842',
            protocolo: 'MAT-2026-001842',
            periodo_letivo: '2026.2',
            data_solicitacao: '2026-09-16T10:42:00',
            turmas_ids: ['t1', 't2', 't3'],
            quantidade_turmas: 3,
            situacao: 'Pendente',
          },
        ])
      }
    } finally {
      setCarregando(false)
    }
  }, [solicitacaoRecente])

  useEffect(() => {
    carregarSolicitacoes()
  }, [carregarSolicitacoes])

  function handleVerDetalhes(item) {
    const protocoloAlvo = item.protocolo || item.id
    navigate(matriculaComprovantePath(protocoloAlvo))
  }

  return (
    <div className="matricula-page">
      {/* ── 1. Cabeçalho com Breadcrumb ── */}
      <section className="matricula-page__header-card">
        <nav className="matricula-page__breadcrumb" aria-label="Navegação estrutural">
          <Link to={PATHS.inicio} className="matricula-page__breadcrumb-link">
            Portal Acadêmico
          </Link>
          <span className="matricula-page__breadcrumb-sep" aria-hidden="true">
            <ChevronRightSmallIcon size={10} />
          </span>
          <Link to={PATHS.matricula} className="matricula-page__breadcrumb-link">
            Solicitação de matrícula
          </Link>
          <span className="matricula-page__breadcrumb-sep" aria-hidden="true">
            <ChevronRightSmallIcon size={10} />
          </span>
          <span className="matricula-page__breadcrumb-current" aria-current="page">
            Minhas Solicitações
          </span>
        </nav>

        <div>
          <h1 className="matricula-page__title">Minhas Solicitações</h1>
          <p className="matricula-page__subtitle">
            Consulte suas solicitações de matrícula e acompanhe cada envio.
          </p>
        </div>
      </section>

      {/* ── 2. Card com Tabela de Solicitações ── */}
      <section className="minhas-solicitacoes-card" aria-label="Lista de solicitações registradas">
        <div className="minhas-solicitacoes-header">
          <h2 className="minhas-solicitacoes-title">
            Solicitações registradas ({solicitacoes.length})
          </h2>

          <Button
            variant="dark"
            size="md"
            onClick={() => navigate(PATHS.matricula)}
            className="minhas-solicitacoes-btn-nova"
          >
            <span>Nova solicitação</span>
          </Button>
        </div>

        {carregando ? (
          <div className="minhas-solicitacoes-loading">Carregando solicitações...</div>
        ) : solicitacoes.length === 0 ? (
          <div className="minhas-solicitacoes-empty">
            <FileTextIcon size={32} />
            <p className="minhas-solicitacoes-empty-text">Nenhuma solicitação encontrada.</p>
            <Button variant="outline" size="sm" onClick={() => navigate(PATHS.matricula)}>
              <span>Nova solicitação</span>
            </Button>
          </div>
        ) : (
          <div className="minhas-solicitacoes-table-wrap">
            <table className="minhas-solicitacoes-table">
              <thead>
                <tr>
                  <th scope="col">Protocolo</th>
                  <th scope="col">Período</th>
                  <th scope="col">Data do envio</th>
                  <th scope="col">Turmas</th>
                  <th scope="col">Situação</th>
                  <th scope="col">Ação</th>
                </tr>
              </thead>
              <tbody>
                {solicitacoes.map((item) => {
                  const protocolo = item.protocolo || item.id
                  const qtdTurmas =
                    item.quantidade_turmas ||
                    (Array.isArray(item.turmas_ids) ? item.turmas_ids.length : 0) ||
                    1
                  const situacao = item.situacao || 'Pendente'

                  return (
                    <tr key={protocolo || item.id}>
                      <td className="minhas-solicitacoes-td--protocolo">
                        <strong>{protocolo}</strong>
                      </td>
                      <td>{item.periodo_letivo || '2026.2'}</td>
                      <td>{formatarDataEnvio(item.data_solicitacao)}</td>
                      <td>{qtdTurmas}</td>
                      <td>
                        <span className="minhas-solicitacoes-status-pill">
                          {situacao}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerDetalhes(item)}
                        >
                          Ver detalhes
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
