import React, { useState } from "react"
import { Link, graphql, PageProps } from "gatsby"
import styled, { keyframes } from "styled-components"
import Layout from "../components/Layout"
import SEO from "../components/atoms/SEO"

/* Elastic UI (EUI) Amsterdam theme palette
 * Ref: https://eui.elastic.co/#/theming/colors */
const E = {
  primary: "#07C",
  accent: "#F04E98",
  success: "#00BFB3",
  warning: "#FEC514",
  danger: "#BD271E",
  textDark: "#1A1C21",
  textSub: "#69707D",
  bgEmpty: "#FFF",
  bgLight: "#F5F7FA",
  bgDark: "#1D1E24",
  border: "#D3DAE6",
  borderDk: "#98A2B3",
  vizGray: "#D3DAE6",
  vizOrange: "#E7664C",
  codeGreen: "#98C379",
  codeBlue: "#61AFEF",
  codePurple: "#C678DD",
  codeOrange: "#D19A66",
  warnBg: "#FEF6E6",
  warnText: "#83650A",
  successBg: "#E6F9F7",
  successText: "#006D60",
} as const

const MONO = `"SFMono-Regular",Consolas,"Liberation Mono",monospace`

const HIST = [12,8,15,6,10,9,14,7,11,5,8,13,6,9,42,10,7,12,8,14,6,11,9,7]
const SPIKE = 14

const FIELDS = [
  { name: "@timestamp", type: "date" },
  { name: "level", type: "keyword" },
  { name: "http.method", type: "keyword" },
  { name: "url.path", type: "text" },
  { name: "http.status_code", type: "number" },
  { name: "message", type: "text" },
  { name: "service.name", type: "keyword" },
  { name: "host.name", type: "keyword" },
  { name: "trace.id", type: "keyword" },
  { name: "response_time_ms", type: "number" },
]

const FIELD_ICONS: Record<string, string> = {
  date: "📅", keyword: "🏷️", text: "📝", number: "#️⃣",
}

type Level = "WARN" | "INFO"
interface LogEntry {
  time: string; level: Level; method: string
  path: string; status: number; message: string
}

interface NotFoundProps extends PageProps {
  data: { site: { siteMetadata: { title: string } } }
}

const NotFoundPage: React.FC<NotFoundProps> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const currentPath = location.pathname
  const maxBar = Math.max(...HIST)

  const [expandedRow, setExpandedRow] = useState<number | null>(0)
  const [expandedTab, setExpandedTab] = useState<"json" | "table">("json")
  const [fieldSearch, setFieldSearch] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const logs: LogEntry[] = [
    { time: "19:45:32.001", level: "WARN", method: "GET", path: currentPath, status: 404, message: "Page not found" },
    { time: "19:45:31.887", level: "INFO", method: "GET", path: "/blog/", status: 200, message: "OK" },
    { time: "19:45:30.442", level: "INFO", method: "GET", path: "/static/js/main.js", status: 200, message: "OK" },
    { time: "19:45:29.112", level: "WARN", method: "GET", path: currentPath, status: 404, message: "Page not found" },
    { time: "19:45:28.003", level: "INFO", method: "GET", path: "/", status: 200, message: "OK" },
  ]

  const makeJson = (entry: LogEntry) => JSON.stringify({
    "@timestamp": `2026-03-19T${entry.time}Z`,
    request: { method: entry.method, url: `https://notes.clementino.me${entry.path}`, headers: { "user-agent": "Mozilla/5.0 (curious-reader/1.0)" } },
    response: { status_code: entry.status, body_bytes_sent: entry.status === 404 ? 0 : 4821 },
    server: { name: "nginx/1.25.4", message: entry.status === 404 ? `open() "${entry.path}" failed (2: No such file or directory)` : "OK" },
    level: entry.level, service: { name: "blog-gateway" }, host: { name: "ip-172-31-42-7" },
    trace: { id: crypto.randomUUID?.() || "abc-123-def" }, response_time_ms: entry.status === 404 ? 2 : 142,
  }, null, 2)

  const filteredFields = FIELDS.filter(f => f.name.toLowerCase().includes(fieldSearch.toLowerCase()))
  const warnCount = logs.filter(l => l.level === "WARN").length

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="404: Not Found" />

      {/* Top nav */}
      <Nav>
        <NavL>
          <KIcon viewBox="0 0 32 32" width="20" height="20"><path d="M4 0v32L28 16z" fill={E.primary}/><path d="M4 0v20l12-4z" fill={E.textDark} opacity=".7"/></KIcon>
          <NavBrand>notes.clementino.me</NavBrand>
          <NavSep>›</NavSep>
          <NavCrumb>Discover</NavCrumb>
        </NavL>
        <NavR>
          <Tab $active>Discover</Tab>
          <Tab>Dashboard</Tab>
          <Tab>Visualize</Tab>
          <Refresh>↻ Refresh</Refresh>
        </NavR>
      </Nav>

      {/* KQL bar */}
      <KqlBar>
        <KqlIcon>🔍</KqlIcon>
        <KqlInput readOnly value={`response.status_code: 404 AND url.path: "${currentPath}"`} />
        <KqlBadge>KQL</KqlBadge>
        <TimeBadge>⏱ Last 15 min</TimeBadge>
      </KqlBar>

      {/* Filter chips */}
      <ChipBar>
        <Chip $color={E.danger}>
          <ChipLabel>status_code:</ChipLabel> 404
          <ChipAction title="Invert">⊘</ChipAction>
          <ChipAction title="Remove">✕</ChipAction>
        </Chip>
        <Chip $color={E.primary}>
          <ChipLabel>url.path:</ChipLabel> {currentPath}
          <ChipAction title="Pin">📌</ChipAction>
          <ChipAction title="Remove">✕</ChipAction>
        </Chip>
      </ChipBar>

      {/* Hits */}
      <Hits>{warnCount} hits</Hits>

      <DiscoverBody>
        {/* Sidebar */}
        <Sidebar $open={sidebarOpen}>
          <SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? "◀" : "▶"}
          </SidebarToggle>
          {sidebarOpen && (
            <>
              <SidebarTitle>Available fields</SidebarTitle>
              <FieldSearch
                placeholder="Search field names"
                value={fieldSearch}
                onChange={e => setFieldSearch(e.target.value)}
              />
              <FieldList>
                {filteredFields.map(f => (
                  <FieldItem key={f.name}>
                    <FieldIcon>{FIELD_ICONS[f.type]}</FieldIcon>
                    <FieldName>{f.name}</FieldName>
                    <FieldType>{f.type}</FieldType>
                  </FieldItem>
                ))}
              </FieldList>
              <SidebarTitle style={{ marginTop: 16 }}>Selected fields</SidebarTitle>
              <FieldList>
                {["@timestamp", "level", "url.path", "http.status_code"].map(n => {
                  const f = FIELDS.find(x => x.name === n)!
                  return (
                    <FieldItem key={n} $selected>
                      <FieldIcon>{FIELD_ICONS[f.type]}</FieldIcon>
                      <FieldName>{f.name}</FieldName>
                    </FieldItem>
                  )
                })}
              </FieldList>
            </>
          )}
        </Sidebar>

        {/* Main content */}
        <Main>
          {/* Speech bubble */}
          <BubbleWrap>
            <Bubble>
              <BubbleEmoji>🕵️</BubbleEmoji>
              <BubbleMsg>
                <strong>Ops!</strong> Parece que você tentou ler um rascunho que eu ainda não escrevi.
                A página <BubblePath>{currentPath}</BubblePath> não existe.
              </BubbleMsg>
              <BubbleNav>
                <BLink to="/">🏠 Voltar para o Início</BLink>
                <BSep>|</BSep>
                <BLink to="/blog/">🔍 Tentar pesquisar</BLink>
              </BubbleNav>
            </Bubble>
          </BubbleWrap>

          {/* Histogram */}
          <Panel>
            <HistWrap>
              {HIST.map((v, i) => (
                <BarCol key={i}>
                  <Bar $h={(v / maxBar) * 100} $spike={i === SPIKE} />
                  {i % 6 === 0 && <BarLbl>{`${String(i).padStart(2, "0")}:00`}</BarLbl>}
                </BarCol>
              ))}
            </HistWrap>
            <HistFoot>Count per hour — <code>{currentPath}</code></HistFoot>
          </Panel>

          {/* Table */}
          <Panel>
            <TblHead><TblTitle>Documents</TblTitle></TblHead>
            <TblScroll>
              <Table>
                <thead>
                  <tr>
                    <TH $w="30px" />
                    <TH $w="120px">Time</TH>
                    <TH $w="70px">Level</TH>
                    <TH $w="60px">Method</TH>
                    <TH>Path</TH>
                    <TH $w="70px">Status</TH>
                    <TH>Message</TH>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l, i) => (
                    <React.Fragment key={i}>
                      <Row $warn={l.level === "WARN"} onClick={() => setExpandedRow(expandedRow === i ? null : i)}>
                        <TD><Caret $open={expandedRow === i}>▶</Caret></TD>
                        <TD><M>{l.time}</M></TD>
                        <TD><Lvl $l={l.level}>{l.level}</Lvl></TD>
                        <TD><Meth>{l.method}</Meth></TD>
                        <TD><M>{l.path}</M></TD>
                        <TD><Stat $err={l.status === 404}>{l.status}</Stat></TD>
                        <TD>{l.message}</TD>
                      </Row>
                      {expandedRow === i && (
                        <ExpRow>
                          <td colSpan={7}>
                            <ExpTabs>
                              <ExpTab $on={expandedTab === "json"} onClick={() => setExpandedTab("json")}>JSON</ExpTab>
                              <ExpTab $on={expandedTab === "table"} onClick={() => setExpandedTab("table")}>Table</ExpTab>
                            </ExpTabs>
                            {expandedTab === "json" ? (
                              <Json>{makeJson(l)}</Json>
                            ) : (
                              <FieldTable>
                                <tbody>
                                  {Object.entries(JSON.parse(makeJson(l))).map(([k, v]) => (
                                    <tr key={k}>
                                      <FTKey>{k}</FTKey>
                                      <FTVal>{typeof v === "object" ? JSON.stringify(v) : String(v)}</FTVal>
                                    </tr>
                                  ))}
                                </tbody>
                              </FieldTable>
                            )}
                          </td>
                        </ExpRow>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </TblScroll>
            <Pager>
              <PagerInfo>Rows per page: 5</PagerInfo>
              <PagerNav>
                <PagerBtn disabled>‹ Prev</PagerBtn>
                <PagerCurrent>1 of 1</PagerCurrent>
                <PagerBtn disabled>Next ›</PagerBtn>
              </PagerNav>
            </Pager>
          </Panel>
        </Main>
      </DiscoverBody>
    </Layout>
  )
}

/* ---- Styled Components ---- */

const KIcon = styled.svg``
const Nav = styled.nav`
  display:flex;justify-content:space-between;align-items:center;
  padding:0 16px;height:48px;background:${E.bgEmpty};
  border-bottom:1px solid ${E.border};margin:-8px -12px 12px;flex-wrap:wrap;
`
const NavL = styled.div`display:flex;align-items:center;gap:8px;`
const NavBrand = styled.span`font-weight:700;font-size:14px;color:${E.textDark};`
const NavSep = styled.span`color:${E.borderDk};font-size:12px;`
const NavCrumb = styled.span`color:${E.textSub};font-size:14px;`
const NavR = styled.div`display:flex;align-items:center;gap:4px;`
const Tab = styled.button<{$active?:boolean}>`
  padding:6px 12px;font-size:13px;font-weight:${p=>p.$active?700:400};
  color:${p=>p.$active?E.primary:E.textSub};background:none;border:none;
  border-bottom:2px solid ${p=>p.$active?E.primary:"transparent"};cursor:pointer;
  &:hover{color:${E.primary}}
  @media(max-width:640px){display:${p=>p.$active?"block":"none"}}
`
const Refresh = styled.button`
  display:flex;align-items:center;gap:4px;padding:6px 16px;font-size:13px;
  font-weight:600;color:${E.bgEmpty};background:${E.primary};border:none;
  border-radius:6px;cursor:pointer;margin-left:8px;
  &:hover{filter:brightness(.9)}
`

const KqlBar = styled.div`
  display:flex;align-items:center;padding:8px 12px;background:${E.bgEmpty};
  border:1px solid ${E.border};border-radius:6px;margin-bottom:8px;gap:8px;
`
const KqlIcon = styled.span`font-size:14px;color:${E.textSub};`
const KqlInput = styled.input`
  flex:1;border:none;outline:none;font-family:${MONO};font-size:13px;
  color:${E.textDark};background:transparent;
`
const KqlBadge = styled.span`
  padding:2px 6px;border-radius:4px;font-size:11px;font-weight:700;
  background:${E.bgLight};color:${E.textSub};border:1px solid ${E.border};
`
const TimeBadge = styled.span`
  padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;
  background:${E.bgLight};color:${E.textDark};border:1px solid ${E.border};white-space:nowrap;
`

const ChipBar = styled.div`display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;`
const Chip = styled.div<{$color:string}>`
  display:inline-flex;align-items:center;gap:4px;padding:4px 8px;
  border-radius:4px;font-size:12px;font-family:${MONO};
  background:${p=>p.$color}18;border:1px solid ${p=>p.$color}44;color:${p=>p.$color};
`
const ChipLabel = styled.span`font-weight:700;`
const ChipAction = styled.span`
  cursor:pointer;opacity:.6;margin-left:2px;font-size:10px;
  &:hover{opacity:1}
`

const Hits = styled.div`font-size:13px;font-weight:600;color:${E.textSub};margin-bottom:12px;`

const DiscoverBody = styled.div`display:flex;gap:12px;align-items:flex-start;`

/* Sidebar */
const Sidebar = styled.aside<{$open:boolean}>`
  width:${p=>p.$open?"220px":"32px"};min-width:${p=>p.$open?"220px":"32px"};
  background:${E.bgEmpty};border:1px solid ${E.border};border-radius:6px;
  padding:${p=>p.$open?"12px":"4px"};transition:width .2s;overflow:hidden;
  @media(max-width:768px){display:none}
`
const SidebarToggle = styled.button`
  background:none;border:none;cursor:pointer;font-size:12px;color:${E.textSub};
  padding:4px;width:100%;text-align:center;
  &:hover{color:${E.primary}}
`
const SidebarTitle = styled.div`
  font-size:11px;font-weight:700;color:${E.textSub};text-transform:uppercase;
  letter-spacing:.5px;margin-bottom:8px;
`
const FieldSearch = styled.input`
  width:100%;padding:6px 8px;border:1px solid ${E.border};border-radius:4px;
  font-size:12px;margin-bottom:8px;outline:none;background:${E.bgLight};
  &:focus{border-color:${E.primary}}
`
const FieldList = styled.div`display:flex;flex-direction:column;gap:2px;`
const FieldItem = styled.div<{$selected?:boolean}>`
  display:flex;align-items:center;gap:6px;padding:4px 6px;border-radius:4px;
  font-size:12px;cursor:pointer;
  background:${p=>p.$selected?`${E.primary}10`:"transparent"};
  &:hover{background:${E.bgLight}}
`
const FieldIcon = styled.span`font-size:11px;`
const FieldName = styled.span`color:${E.textDark};flex:1;font-family:${MONO};font-size:11px;`
const FieldType = styled.span`color:${E.borderDk};font-size:10px;`

/* Main */
const Main = styled.div`flex:1;min-width:0;`

/* Bubble */
const BubbleWrap = styled.div`display:flex;justify-content:center;margin-bottom:16px;`
const Bubble = styled.div`
  background:${E.bgEmpty};border:2px solid ${E.primary};border-radius:12px;
  padding:20px 24px;max-width:520px;text-align:center;
  box-shadow:0 6px 20px rgba(0,119,204,.1);position:relative;
  &::before{content:"";position:absolute;bottom:-12px;left:50%;transform:translateX(-50%);
    border:12px solid transparent;border-top-color:${E.primary}}
  &::after{content:"";position:absolute;bottom:-9px;left:50%;transform:translateX(-50%);
    border:10px solid transparent;border-top-color:${E.bgEmpty}}
`
const BubbleEmoji = styled.div`font-size:2rem;margin-bottom:8px;`
const BubbleMsg = styled.p`margin:0 0 12px;font-size:15px;line-height:1.6;color:${E.textDark};`
const BubblePath = styled.code`
  background:${E.bgLight};padding:2px 6px;border-radius:4px;
  font-size:13px;color:${E.vizOrange};font-weight:600;
`
const BubbleNav = styled.div`display:flex;justify-content:center;gap:12px;align-items:center;`
const BLink = styled(Link)`color:${E.primary};text-decoration:none;font-weight:600;font-size:14px;&:hover{text-decoration:underline}`
const BSep = styled.span`color:${E.border};`

/* Histogram */
const Panel = styled.div`
  background:${E.bgEmpty};border:1px solid ${E.border};border-radius:6px;
  margin-bottom:16px;overflow:hidden;
`
const HistWrap = styled.div`
  display:flex;align-items:flex-end;gap:2px;padding:16px 16px 0;height:100px;
`
const BarCol = styled.div`
  flex:1;display:flex;flex-direction:column;align-items:center;
  height:100%;justify-content:flex-end;
`
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.6}`
const Bar = styled.div<{$h:number;$spike:boolean}>`
  width:100%;border-radius:2px 2px 0 0;height:${p=>p.$h}%;
  background:${p=>p.$spike?E.vizOrange:E.vizGray};
  animation:${p=>p.$spike?pulse:"none"} 2s infinite;
  cursor:pointer;transition:filter .15s;
  &:hover{filter:brightness(.85)}
`
const BarLbl = styled.span`font-size:10px;color:${E.borderDk};margin-top:4px;`
const HistFoot = styled.div`
  padding:8px 16px 12px;font-size:12px;color:${E.textSub};
  code{background:${E.bgLight};padding:1px 4px;border-radius:3px;font-size:11px}
`

/* Table */
const TblHead = styled.div`padding:10px 16px;border-bottom:1px solid ${E.border};background:${E.bgLight};`
const TblTitle = styled.h4`margin:0;font-size:13px;color:${E.textDark};font-weight:600;`
const TblScroll = styled.div`overflow-x:auto;`
const Table = styled.table`width:100%;border-collapse:collapse;font-size:13px;`
const TH = styled.th<{$w?:string}>`
  text-align:left;padding:8px 12px;background:${E.bgLight};color:${E.textSub};
  font-weight:600;font-size:12px;border-bottom:1px solid ${E.border};
  width:${p=>p.$w||"auto"};white-space:nowrap;
`
const Row = styled.tr<{$warn:boolean}>`
  background:${p=>p.$warn?E.warnBg:E.bgEmpty};cursor:pointer;
  &:hover{background:${E.bgLight}}
`
const TD = styled.td`
  padding:6px 12px;border-bottom:1px solid ${E.bgLight};
  color:${E.textDark};white-space:nowrap;
`
const Caret = styled.span<{$open:boolean}>`
  display:inline-block;font-size:10px;color:${E.textSub};
  transform:rotate(${p=>p.$open?90:0}deg);transition:transform .15s;
`
const M = styled.span`font-family:${MONO};font-size:12px;`
const Lvl = styled.span<{$l:Level}>`
  padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;
  background:${p=>p.$l==="WARN"?E.warnBg:E.successBg};
  color:${p=>p.$l==="WARN"?E.warnText:E.successText};
`
const Meth = styled.span`font-family:${MONO};font-size:12px;font-weight:600;color:${E.primary};`
const Stat = styled.span<{$err:boolean}>`
  font-weight:700;font-family:${MONO};font-size:13px;
  color:${p=>p.$err?E.danger:E.successText};
`

const ExpRow = styled.tr`td{padding:0;border-bottom:1px solid ${E.border}}`
const ExpTabs = styled.div`
  display:flex;gap:0;border-bottom:1px solid ${E.border};background:${E.bgLight};
`
const ExpTab = styled.button<{$on:boolean}>`
  padding:6px 16px;font-size:12px;font-weight:600;border:none;cursor:pointer;
  background:${p=>p.$on?E.bgEmpty:"transparent"};
  color:${p=>p.$on?E.primary:E.textSub};
  border-bottom:2px solid ${p=>p.$on?E.primary:"transparent"};
`
const Json = styled.pre`
  margin:0;padding:16px 20px;background:${E.bgDark};color:${E.codeGreen};
  font-size:12px;line-height:1.7;font-family:${MONO};overflow-x:auto;
`
const FieldTable = styled.table`
  width:100%;border-collapse:collapse;font-size:12px;
`
const FTKey = styled.td`
  padding:6px 12px;font-family:${MONO};font-weight:600;color:${E.primary};
  border-bottom:1px solid ${E.bgLight};width:200px;vertical-align:top;
`
const FTVal = styled.td`
  padding:6px 12px;font-family:${MONO};color:${E.textDark};
  border-bottom:1px solid ${E.bgLight};word-break:break-all;
`

const Pager = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:8px 16px;border-top:1px solid ${E.border};background:${E.bgLight};
`
const PagerInfo = styled.span`font-size:12px;color:${E.textSub};`
const PagerNav = styled.div`display:flex;align-items:center;gap:8px;`
const PagerBtn = styled.button`
  padding:4px 10px;font-size:12px;border:1px solid ${E.border};border-radius:4px;
  background:${E.bgEmpty};color:${E.textSub};cursor:pointer;
  &:disabled{opacity:.4;cursor:default}
`
const PagerCurrent = styled.span`font-size:12px;color:${E.textDark};font-weight:600;`

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export default NotFoundPage
