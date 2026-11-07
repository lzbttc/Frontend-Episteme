import Modal from '../Modal/Modal'
import Button from '../Button/Button'
import Badge from '../Badge/Badge'
import {
  CalendarIcon,
  ClockIcon,
  EditIcon,
  TrashIcon,
} from '../icons'
import {
  formatarDataHora,
  determinarSituacao,
  decodificarMetadadosDoCorpo,
} from '../../services/comunicadoService'
import './ModalDetalhesComunicado.css'

/**
 * Separa a URL válida de eventuais pontuações de final de frase (ex.: '.', ',', ';', '!', '?', ')')
 * preservando a integridade do link e a sintaxe do texto ao redor.
 *
 * @param {string} candidatoUrl
 * @returns {{ url: string, pontuacao: string }}
 */
function extrairUrlEPontuacao(candidatoUrl) {
  let url = candidatoUrl
  let pontuacao = ''
  const pontuacaoFinalRegex = /([.,;:!?]+)$/

  while (true) {
    const matchPont = url.match(pontuacaoFinalRegex)
    if (matchPont) {
      pontuacao = matchPont[1] + pontuacao
      url = url.slice(0, -matchPont[1].length)
      continue
    }
    // Trata fechamento de parênteses não balanceado (ex.: '(consulte https://exemplo.com)')
    if (url.endsWith(')')) {
      const aberturas = (url.match(/\(/g) || []).length
      const fechamentos = (url.match(/\)/g) || []).length
      if (fechamentos > aberturas) {
        pontuacao = ')' + pontuacao
        url = url.slice(0, -1)
        continue
      }
    }
    break
  }
  return { url, pontuacao }
}

/**
 * Converte URLs http(s) em tags âncora seguras sem usar innerHTML perigoso,
 * preservando pontuações gramaticais adjacentes e garantindo atributos de segurança.
 */
function renderizarTextoComLinks(texto) {
  if (!texto) return null
  const urlRegex = /(https?:\/\/[^\s<]+)/g
  const partes = texto.split(urlRegex)
  if (partes.length === 1) return texto

  return partes.map((parte, idx) => {
    if (/^https?:\/\//.test(parte)) {
      const { url, pontuacao } = extrairUrlEPontuacao(parte)
      return (
        <span key={idx}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-detalhes-comunicado__link"
          >
            {url}
          </a>
          {pontuacao}
        </span>
      )
    }
    return parte
  })
}

/**
 * Modal padronizada para visualização detalhada de um comunicado institucional.
 * Utilizada tanto na área pública do estudante (Início e Notícias) quanto
 * no painel administrativo da coordenação.
 *
 * @param {Object} props
 * @param {Object | null} props.comunicado - Comunicado a ser exibido
 * @param {boolean} props.isOpen - Se a modal está aberta
 * @param {Function} props.onClose - Callback para fechar a modal
 * @param {boolean} [props.ehAdmin=false] - Se deve exibir controles e metadados de administração
 * @param {Function} [props.onEditar] - Callback opcional para editar (área administrativa)
 * @param {Function} [props.onExcluir] - Callback opcional para excluir (área administrativa)
 */
function ModalDetalhesComunicado({
  comunicado,
  isOpen,
  onClose,
  ehAdmin = false,
  onEditar,
  onExcluir,
}) {
  if (!isOpen || !comunicado) return null

  const titulo = comunicado.title || comunicado.titulo || 'Comunicado Sem Título'
  const resumo = comunicado.summary || comunicado.resumo || ''
  const corpoCru = comunicado.corpo || comunicado.summary || comunicado.resumo || ''
  const { corpoLimpo } = decodificarMetadadosDoCorpo(corpoCru)

  const dataReferencia =
    comunicado.publicado_em || comunicado.inicio_em || new Date().toISOString()
  const dataFormatada = formatarDataHora(dataReferencia)

  const situacao = determinarSituacao(comunicado)

  // Configuração visual de crachá (Badge)
  const renderBadge = () => {
    if (!ehAdmin) {
      return (
        <Badge variant="success" size="sm">
          Comunicado Oficial
        </Badge>
      )
    }

    switch (situacao) {
      case 'programado':
        return (
          <Badge variant="info" size="sm">
            Programado
          </Badge>
        )
      case 'expirado':
        return (
          <Badge variant="neutral" size="sm">
            Expirado
          </Badge>
        )
      case 'rascunho':
        return (
          <Badge variant="warning" size="sm">
            Rascunho
          </Badge>
        )
      case 'publicado':
      default:
        return (
          <Badge variant="success" size="sm">
            Publicado
          </Badge>
        )
    }
  }

  // Divisão em parágrafos preservando quebras de linha (LF e CRLF) e recuos pretendidos (espaços no início da linha)
  const paragrafos = (corpoLimpo || resumo)
    .split(/(?:\r?\n|\r){2,}/)
    .map((p) => p.replace(/^[\r\n]+|[\r\n]+$/g, ''))
    .filter((p) => p.trim().length > 0)

  const temVigenciaConfigurada = Boolean(comunicado.inicio_em || comunicado.expira_em)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Comunicado Institucional"
      className="modal-detalhes-comunicado-root"
    >
      <div className="modal-detalhes-comunicado">
        {/* Cabeçalho de Metadados */}
        <header className="modal-detalhes-comunicado__meta-header">
          <div className="modal-detalhes-comunicado__date-wrap">
            <CalendarIcon size={15} aria-hidden="true" />
            <time dateTime={dataReferencia}>{dataFormatada}</time>
          </div>
          <div className="modal-detalhes-comunicado__badge-wrap">
            {renderBadge()}
          </div>
        </header>

        {/* Título Principal */}
        <h2 className="modal-detalhes-comunicado__title">{titulo}</h2>

        {/* Informações de Período / Vigência */}
        {temVigenciaConfigurada && (
          <div className="modal-detalhes-comunicado__validity-card">
            <ClockIcon size={16} className="modal-detalhes-comunicado__clock-icon" aria-hidden="true" />
            <div className="modal-detalhes-comunicado__validity-text">
              <strong>Período de Disponibilidade:</strong>
              {comunicado.inicio_em && comunicado.expira_em ? (
                <span>
                  De {formatarDataHora(comunicado.inicio_em)} até{' '}
                  {formatarDataHora(comunicado.expira_em)}
                </span>
              ) : comunicado.expira_em ? (
                <span>Válido até {formatarDataHora(comunicado.expira_em)}</span>
              ) : (
                <span>A partir de {formatarDataHora(comunicado.inicio_em)}</span>
              )}
            </div>
          </div>
        )}

        {/* Resumo Institucional */}
        {resumo && (
          <section className="modal-detalhes-comunicado__summary-section">
            <strong className="modal-detalhes-comunicado__section-label">
              Resumo:
            </strong>
            <p className="modal-detalhes-comunicado__summary-text">{resumo}</p>
          </section>
        )}

        {/* Conteúdo Completo */}
        <section className="modal-detalhes-comunicado__body-section">
          <strong className="modal-detalhes-comunicado__section-label">
            Conteúdo Integral:
          </strong>
          <div className="modal-detalhes-comunicado__paragraphs">
            {paragrafos.length > 0 ? (
              paragrafos.map((paragrafo, index) => (
                <p key={index}>{renderizarTextoComLinks(paragrafo)}</p>
              ))
            ) : (
              <p>{renderizarTextoComLinks(resumo)}</p>
            )}
          </div>
        </section>

        {/* Aviso de Rascunho se aplicável */}
        {!comunicado.publicado && (
          <div
            className="modal-detalhes-comunicado__draft-notice"
            role="note"
          >
            <strong className="modal-detalhes-comunicado__draft-notice-title">
              Situação de Rascunho
            </strong>
            <p>
              Este comunicado está salvo como rascunho institucional e
              permanece não publicado para a comunidade acadêmica.
            </p>
          </div>
        )}

        {/* Rodapé com Ações */}
        <footer className="modal-detalhes-comunicado__footer">
          <div className="modal-detalhes-comunicado__footer-main">
            <Button variant="secondary" size="md" onClick={onClose}>
              Fechar
            </Button>
          </div>

          {ehAdmin && (onEditar || onExcluir) && (
            <div className="modal-detalhes-comunicado__footer-admin-actions">
              {onEditar && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose()
                    onEditar(comunicado)
                  }}
                >
                  <EditIcon size={14} />
                  <span>Editar</span>
                </Button>
              )}
              {onExcluir && (
                <Button
                  variant="outline"
                  size="sm"
                  className="modal-detalhes-comunicado__btn-delete"
                  onClick={() => {
                    onClose()
                    onExcluir(comunicado)
                  }}
                >
                  <TrashIcon size={14} />
                  <span>Excluir</span>
                </Button>
              )}
            </div>
          )}
        </footer>
      </div>
    </Modal>
  )
}

export default ModalDetalhesComunicado
