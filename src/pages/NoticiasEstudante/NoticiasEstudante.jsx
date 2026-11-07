import { useState, useMemo, useCallback, useEffect } from 'react'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import Button from '../../components/Button/Button'
import NewsCard from '../../components/NewsCard/NewsCard'
import Input from '../../components/Input/Input'
import ModalDetalhesComunicado from '../../components/ModalDetalhesComunicado/ModalDetalhesComunicado'
import {
  SearchIcon,
  MegaphoneIcon,
} from '../../components/icons'
import { PATHS } from '../../routes/paths'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useAsyncData } from '../../hooks/useAsyncData'
import {
  estaAtivoParaEstudante,
  normalizarTextoParaBusca,
} from '../../services/comunicadoService'
import { listarTodasNoticiasEstudante } from '../../services/alunoService'
import './NoticiasEstudante.css'

function NoticiasEstudante() {
  usePageTitle('Notícias Institucionais')

  const [busca, setBusca] = useState('')
  const [noticiaSelecionada, setNoticiaSelecionada] = useState(null)
  const [agoraTimestamp, setAgoraTimestamp] = useState(() => Date.now())

  // Ticker de tempo real para expiração automática sem necessidade de recarregar a tela
  useEffect(() => {
    const interval = setInterval(() => {
      setAgoraTimestamp(Date.now())
    }, 5000)

    const handleVisibility = () => {
      if (!document.hidden) {
        setAgoraTimestamp(Date.now())
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleVisibility)
    }
  }, [])

  const [tentativas, setTentativas] = useState(0)
  const carregarNoticias = useCallback(async () => {
    return await listarTodasNoticiasEstudante()
  }, [tentativas]) // eslint-disable-line react-hooks/exhaustive-deps

  const { data, loading, error } = useAsyncData(carregarNoticias, [tentativas])

  const listaNoticias = useMemo(() => {
    return Array.isArray(data) ? data : []
  }, [data])

  // Filtra em tempo real apenas notícias estritamente ativas (não expiradas e já iniciadas)
  const noticiasVigentes = useMemo(() => {
    return listaNoticias.filter((item) => estaAtivoParaEstudante(item, agoraTimestamp))
  }, [listaNoticias, agoraTimestamp])

  const noticiasFiltradas = useMemo(() => {
    if (!busca.trim()) return noticiasVigentes
    const termo = normalizarTextoParaBusca(busca)
    return noticiasVigentes.filter((item) => {
      const tit = normalizarTextoParaBusca(item.title || '')
      const res = normalizarTextoParaBusca(item.summary || '')
      const cor = normalizarTextoParaBusca(item.corpo || '')
      return tit.includes(termo) || res.includes(termo) || cor.includes(termo)
    })
  }, [noticiasVigentes, busca])

  return (
    <div className="noticias-estudante">
      {/* 1. Breadcrumb de Navegação */}
      <Breadcrumb
        items={[
          { label: 'Início', to: PATHS.inicio },
          { label: 'Notícias Institucionais' },
        ]}
      />

      {/* 2. Cabeçalho Principal */}
      <header className="noticias-estudante__header">
        <div className="noticias-estudante__title-row">
          <div className="noticias-estudante__icon-badge" aria-hidden="true">
            <MegaphoneIcon size={24} />
          </div>
          <div>
            <h1 className="noticias-estudante__title">
              Notícias e Comunicados Institucionais
            </h1>
            <p className="noticias-estudante__subtitle">
              Acompanhe as publicações oficiais, informes da coordenação e avisos acadêmicos vigentes.
            </p>
          </div>
        </div>
      </header>

      {/* 3. Barra de Pesquisa */}
      <section className="noticias-estudante__toolbar" aria-label="Pesquisa de notícias">
        <div className="noticias-estudante__search-wrapper">
          <SearchIcon size={16} className="noticias-estudante__search-icon" aria-hidden="true" />
          <Input
            type="text"
            role="searchbox"
            className="noticias-estudante__search-input"
            placeholder="Pesquisar por título, resumo ou conteúdo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label="Pesquisar comunicados institucionais"
          />
          {busca && (
            <button
              type="button"
              className="noticias-estudante__search-clear"
              onClick={() => setBusca('')}
              title="Limpar pesquisa"
              aria-label="Limpar pesquisa"
            >
              &times;
            </button>
          )}
        </div>

        <div className="noticias-estudante__count">
          {noticiasFiltradas.length}{' '}
          {noticiasFiltradas.length === 1 ? 'comunicado ativo' : 'comunicados ativos'}
        </div>
      </section>

      {/* 4. Lista de Comunicados */}
      <main className="noticias-estudante__content" aria-label="Lista de comunicados oficiais">
        {loading ? (
          <div className="noticias-estudante__loading">
            <p>Carregando comunicados oficiais...</p>
          </div>
        ) : error ? (
          <div className="noticias-estudante__error" role="alert">
            <p>Não foi possível carregar os comunicados no momento.</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setTentativas((prev) => prev + 1)}
            >
              Tentar novamente
            </Button>
          </div>
        ) : noticiasFiltradas.length === 0 ? (
          <div className="noticias-estudante__empty">
            <div className="noticias-estudante__empty-icon" aria-hidden="true">
              <MegaphoneIcon size={32} />
            </div>
            <h3 className="noticias-estudante__empty-title">
              {busca ? 'Nenhum resultado encontrado' : 'Nenhum comunicado disponível'}
            </h3>
            <p className="noticias-estudante__empty-desc">
              {busca
                ? `Nenhum comunicado ativo corresponde ao termo "${busca}". Tente outros termos.`
                : 'Não há comunicados ou notícias oficiais vigentes no momento.'}
            </p>
            {busca && (
              <Button variant="outline" size="sm" onClick={() => setBusca('')}>
                Limpar pesquisa
              </Button>
            )}
          </div>
        ) : (
          <div className="noticias-estudante__list">
            {noticiasFiltradas.map((item) => (
              <NewsCard
                key={item.id}
                news={item}
                onVisualizar={setNoticiaSelecionada}
              />
            ))}
          </div>
        )}
      </main>

      {/* 5. Modal Padronizada de Visualização */}
      <ModalDetalhesComunicado
        comunicado={noticiaSelecionada}
        isOpen={Boolean(noticiaSelecionada)}
        onClose={() => setNoticiaSelecionada(null)}
        ehAdmin={false}
      />
    </div>
  )
}

export default NoticiasEstudante
