import React from "react"
import { Link, graphql, PageProps } from "gatsby"
import styled, { keyframes } from "styled-components"
import Layout from "../components/Layout"
import SEO from "../components/atoms/SEO"

/*
 * Cores extraídas do Elastic UI (EUI) Amsterdam theme — design system do Kibana.
 * Ref: https://eui.elastic.co/#/theming/colors
 * Ref: https://github.com/elastic/eui
 */
const EUI = {
  // Core
  primary: "#07C",          // euiColorPrimary
  accent: "#F04E98",        // euiColorAccent
  success: "#00BFB3",       // euiColorSuccess
  warning: "#FEC514",       // euiColorWarning
  danger: "#BD271E",        // euiColorDanger

  // Text
  textPrimary: "#006BB8",
  textDark: "#1A1C21",      // euiTextColor
  textSubdued: "#69707D",   // euiTextSubduedColor

  // Backgrounds
  bgEmpty: "#FFF",
  bgLight: "#F5F7FA",       // euiColorLightestShade
  bgPanel: "#FFF",
  bgDark: "#1D1E24",        // euiColorDarkestShade (code blocks)

  // Borders
  border: "#D3DAE6",        // euiColorLightShade
  borderDark: "#98A2B3",    // euiColorMediumShade

  // Viz palette (Kibana chart colors)
  vizGray: "#D3DAE6",
  vizOrange: "#E7664C",     // euiColorVis5 (alert/spike)

  // Status
  warnBg: "#FEF6E6",
  warnText: "#83650A",
  successBg: "#E6F9F7",
  successText: "#006D60",

  // Code
  codeGreen: "#98C379",
  codeBlue: "#61AFEF",
  codePurple: "#C678DD",
  codeOrange: "#D19A66",
} as const

const SITE_URL = "https://notes.clementino.me"

const HISTOGRAM_DATA = [
  12, 8, 15, 6, 10, 9, 14, 7, 11, 5, 8, 13,
  6, 9, 42, 10, 7, 12, 8, 14, 6, 11, 9, 7,
]

interface NotFoundProps extends PageProps {
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }
  }
}

const NotFoundPage: React.FC<NotFoundProps> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const currentPath = location.pathname
  const maxBar = Math.max(...HISTOGRAM_DATA)

  const logEntries = [
    { time: "19:45:32.001", level: "WARN" as const, method: "GET", path: currentPath, status: 404, message: "Page not found" },
    { time: "19:45:31.887", level: "INFO" as const, method: "GET", path: "/blog/", status: 200, message: "OK" },
    { time: "19:45:30.442", level: "INFO" as const, method: "GET", path: "/static/js/main.js", status: 200, message: "OK" },
    { time: "19:45:29.112", level: "WARN" as const, method: "GET", path: currentPath, status: 404, message: "Page not found" },
    { time: "19:45:28.003", level: "INFO" as const, method: "GET", path: "/", status: 200, message: "OK" },
  ]

  const expandedJson = `{
  "@timestamp": "2026-03-19T19:45:32.001Z",
  "request": {
    "method": "GET",
    "url": "${SITE_URL}${currentPath}",
    "headers": {
      "user-agent": "Mozilla/5.0 (curious-reader/1.0)"
    }
  },
  "response": {
    "status_code": 404,
    "body_bytes_sent": 0
  },
  "server": {
    "name": "nginx/1.25.4",
    "message": "open() \\"${currentPath}\\" failed (2: No such file or directory)"
  }
}`

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="404: Not Found" />

      <NavBar>
        <NavLeft>
          <NavLogo>
            <KibanaIcon viewBox="0 0 32 32" width="24" height="24">
              <path d="M4 0v32L28 16z" fill={EUI.primary} />
              <path d="M4 0v20l12-4z" fill={EUI.textDark} opacity="0.7" />
            </KibanaIcon>
          </NavLogo>
          <NavTitle>notes.clementino.me</NavTitle>
          <NavBreadcrumbSep>›</NavBreadcrumbSep>
          <NavBreadcrumb>Discover</NavBreadcrumb>
        </NavLeft>
        <NavRight>
          <NavTab $active>Discover</NavTab>
          <NavTab>Dashboard</NavTab>
          <NavTab>Visualize</NavTab>
          <RefreshButton>
            <RefreshIcon>↻</RefreshIcon> Refresh
          </RefreshButton>
        </NavRight>
      </NavBar>

      {/* Filter bar — Kibana KQL style */}
      <FilterBar>
        <FilterIcon>🔍</FilterIcon>
        <FilterInput
          readOnly
          value={`response.status_code: 404 AND request.path: "${currentPath}"`}
        />
        <FilterBadge>KQL</FilterBadge>
        <TimeRangeBadge>Last 15 min</TimeRangeBadge>
      </FilterBar>

      {/* Hits count */}
      <HitsBar>
        <HitsCount>2 hits</HitsCount>
      </HitsBar>

      {/* Histogram */}
      <Panel>
        <HistogramContainer>
          {HISTOGRAM_DATA.map((value, i) => (
            <BarWrapper key={i}>
              <Bar $height={(value / maxBar) * 100} $isSpike={i === 14} />
              {i % 6 === 0 && <BarLabel>{`${String(i).padStart(2, "0")}:00`}</BarLabel>}
            </BarWrapper>
          ))}
        </HistogramContainer>
        <HistogramFooter>
          Count of incidents by hour — <code>{currentPath}</code>
        </HistogramFooter>
      </Panel>

      {/* Speech Bubble */}
      <BubbleWrapper>
        <SpeechBubble>
          <BubbleEmoji>🕵️</BubbleEmoji>
          <BubbleText>
            <strong>Ops!</strong> Parece que você tentou ler um rascunho que eu ainda não escrevi.
            A página <BubblePath>{currentPath}</BubblePath> não existe.
          </BubbleText>
          <BubbleActions>
            <BubbleLink to="/">🏠 Voltar para o Início</BubbleLink>
            <BubbleSep>|</BubbleSep>
            <BubbleLink to="/blog/">🔍 Tentar pesquisar</BubbleLink>
          </BubbleActions>
        </SpeechBubble>
      </BubbleWrapper>

      {/* Logs Table */}
      <Panel>
        <TableHeader>
          <TableTitle>Documents</TableTitle>
        </TableHeader>
        <TableWrapper>
          <LogTable>
            <thead>
              <tr>
                <Th $width="120px">Time</Th>
                <Th $width="70px">Level</Th>
                <Th $width="60px">Method</Th>
                <Th>Path</Th>
                <Th $width="70px">Status</Th>
                <Th>Message</Th>
              </tr>
            </thead>
            <tbody>
              {logEntries.map((entry, i) => (
                <React.Fragment key={i}>
                  <LogRow $isWarn={entry.level === "WARN"}>
                    <Td><Mono>{entry.time}</Mono></Td>
                    <Td><LevelBadge $level={entry.level}>{entry.level}</LevelBadge></Td>
                    <Td><MethodBadge>{entry.method}</MethodBadge></Td>
                    <Td><Mono>{entry.path}</Mono></Td>
                    <Td><StatusCode $is404={entry.status === 404}>{entry.status}</StatusCode></Td>
                    <Td>{entry.message}</Td>
                  </LogRow>
                  {i === 0 && (
                    <ExpandedRow>
                      <td colSpan={6}>
                        <ExpandedHeader>
                          <ExpandedTab $active>JSON</ExpandedTab>
                          <ExpandedTab>Table</ExpandedTab>
                        </ExpandedHeader>
                        <JsonBlock>{expandedJson}</JsonBlock>
                      </td>
                    </ExpandedRow>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </LogTable>
        </TableWrapper>
      </Panel>
    </Layout>
  )
}

/* --- Styled Components (EUI Amsterdam theme) --- */

const KibanaIcon = styled.svg``

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 48px;
  background: ${EUI.bgEmpty};
  border-bottom: 1px solid ${EUI.border};
  margin: -8px -12px 16px;
`
const NavLeft = styled.div`display: flex; align-items: center; gap: 8px;`
const NavLogo = styled.span`display: flex; align-items: center;`
const NavTitle = styled.span`font-weight: 600; font-size: 14px; color: ${EUI.textDark};`
const NavBreadcrumbSep = styled.span`color: ${EUI.borderDark}; font-size: 12px;`
const NavBreadcrumb = styled.span`color: ${EUI.textSubdued}; font-size: 14px;`
const NavRight = styled.div`display: flex; align-items: center; gap: 4px;`
const NavTab = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  font-size: 13px;
  font-weight: ${p => p.$active ? 700 : 400};
  color: ${p => p.$active ? EUI.primary : EUI.textSubdued};
  background: none;
  border: none;
  border-bottom: 2px solid ${p => p.$active ? EUI.primary : "transparent"};
  cursor: pointer;
  &:hover { color: ${EUI.primary}; }
  @media (max-width: 640px) { display: ${p => p.$active ? "block" : "none"}; }
`
const RefreshButton = styled.button`
  display: flex; align-items: center; gap: 4px;
  padding: 6px 16px;
  font-size: 13px; font-weight: 600;
  color: ${EUI.bgEmpty};
  background: ${EUI.primary};
  border: none; border-radius: 6px;
  cursor: pointer;
  margin-left: 8px;
  &:hover { background: ${EUI.textPrimary}; }
`
const RefreshIcon = styled.span`font-size: 14px;`

const FilterBar = styled.div`
  display: flex; align-items: center;
  padding: 8px 12px;
  background: ${EUI.bgEmpty};
  border: 1px solid ${EUI.border};
  border-radius: 6px;
  margin-bottom: 12px;
  gap: 8px;
`
const FilterIcon = styled.span`font-size: 14px; color: ${EUI.textSubdued};`
const FilterInput = styled.input`
  flex: 1; border: none; outline: none;
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 13px; color: ${EUI.textDark};
  background: transparent;
`
const FilterBadge = styled.span`
  padding: 2px 6px; border-radius: 4px;
  font-size: 11px; font-weight: 700;
  background: ${EUI.bgLight}; color: ${EUI.textSubdued};
  border: 1px solid ${EUI.border};
`
const TimeRangeBadge = styled.span`
  padding: 4px 10px; border-radius: 6px;
  font-size: 12px; font-weight: 600;
  background: ${EUI.bgLight}; color: ${EUI.textDark};
  border: 1px solid ${EUI.border};
  white-space: nowrap;
`

const HitsBar = styled.div`
  padding: 4px 0 8px;
`
const HitsCount = styled.span`
  font-size: 13px; font-weight: 600; color: ${EUI.textSubdued};
`

const Panel = styled.div`
  background: ${EUI.bgPanel};
  border: 1px solid ${EUI.border};
  border-radius: 6px;
  margin-bottom: 16px;
  overflow: hidden;
`

const HistogramContainer = styled.div`
  display: flex; align-items: flex-end;
  gap: 2px; padding: 16px 16px 0; height: 120px;
`
const BarWrapper = styled.div`
  flex: 1; display: flex; flex-direction: column;
  align-items: center; height: 100%; justify-content: flex-end;
`
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.65}`
const Bar = styled.div<{ $height: number; $isSpike: boolean }>`
  width: 100%; border-radius: 2px 2px 0 0;
  height: ${p => p.$height}%;
  background: ${p => p.$isSpike ? EUI.vizOrange : EUI.vizGray};
  animation: ${p => p.$isSpike ? pulse : "none"} 2s infinite;
`
const BarLabel = styled.span`font-size: 10px; color: ${EUI.borderDark}; margin-top: 4px;`
const HistogramFooter = styled.div`
  padding: 8px 16px 12px;
  font-size: 12px; color: ${EUI.textSubdued};
  code { background: ${EUI.bgLight}; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
`

const BubbleWrapper = styled.div`display: flex; justify-content: center; margin-bottom: 16px;`
const SpeechBubble = styled.div`
  background: ${EUI.bgEmpty};
  border: 2px solid ${EUI.primary};
  border-radius: 12px;
  padding: 20px 24px;
  max-width: 520px;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0, 119, 204, 0.1);
  position: relative;
  &::before {
    content: ""; position: absolute; bottom: -12px; left: 50%;
    transform: translateX(-50%);
    border: 12px solid transparent; border-top-color: ${EUI.primary};
  }
  &::after {
    content: ""; position: absolute; bottom: -9px; left: 50%;
    transform: translateX(-50%);
    border: 10px solid transparent; border-top-color: ${EUI.bgEmpty};
  }
`
const BubbleEmoji = styled.div`font-size: 2rem; margin-bottom: 8px;`
const BubbleText = styled.p`
  margin: 0 0 12px; font-size: 15px; line-height: 1.6; color: ${EUI.textDark};
`
const BubblePath = styled.code`
  background: ${EUI.bgLight}; padding: 2px 6px; border-radius: 4px;
  font-size: 13px; color: ${EUI.vizOrange}; font-weight: 600;
`
const BubbleActions = styled.div`display: flex; justify-content: center; gap: 12px; align-items: center;`
const BubbleLink = styled(Link)`
  color: ${EUI.primary}; text-decoration: none; font-weight: 600; font-size: 14px;
  &:hover { text-decoration: underline; }
`
const BubbleSep = styled.span`color: ${EUI.border};`

const TableHeader = styled.div`
  padding: 10px 16px;
  border-bottom: 1px solid ${EUI.border};
  background: ${EUI.bgLight};
`
const TableTitle = styled.h4`margin: 0; font-size: 13px; color: ${EUI.textDark}; font-weight: 600;`
const TableWrapper = styled.div`overflow-x: auto;`
const LogTable = styled.table`width: 100%; border-collapse: collapse; font-size: 13px;`
const Th = styled.th<{ $width?: string }>`
  text-align: left; padding: 8px 12px;
  background: ${EUI.bgLight}; color: ${EUI.textSubdued};
  font-weight: 600; font-size: 12px;
  border-bottom: 1px solid ${EUI.border};
  width: ${p => p.$width || "auto"};
  white-space: nowrap;
`
const LogRow = styled.tr<{ $isWarn: boolean }>`
  background: ${p => p.$isWarn ? EUI.warnBg : EUI.bgEmpty};
  &:hover { background: ${EUI.bgLight}; }
`
const Td = styled.td`
  padding: 6px 12px; border-bottom: 1px solid ${EUI.bgLight};
  color: ${EUI.textDark}; white-space: nowrap;
`
const Mono = styled.span`font-family: "SFMono-Regular", Consolas, monospace; font-size: 12px;`
const LevelBadge = styled.span<{ $level: "WARN" | "INFO" }>`
  padding: 2px 8px; border-radius: 4px;
  font-size: 11px; font-weight: 700;
  background: ${p => p.$level === "WARN" ? EUI.warnBg : EUI.successBg};
  color: ${p => p.$level === "WARN" ? EUI.warnText : EUI.successText};
`
const MethodBadge = styled.span`
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 12px; font-weight: 600; color: ${EUI.textPrimary};
`
const StatusCode = styled.span<{ $is404: boolean }>`
  font-weight: 700; font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 13px;
  color: ${p => p.$is404 ? EUI.danger : EUI.successText};
`
const ExpandedRow = styled.tr`td { padding: 0; border-bottom: 1px solid ${EUI.border}; }`
const ExpandedHeader = styled.div`
  display: flex; gap: 0; border-bottom: 1px solid ${EUI.border};
  background: ${EUI.bgLight};
`
const ExpandedTab = styled.button<{ $active?: boolean }>`
  padding: 6px 16px; font-size: 12px; font-weight: 600;
  border: none; cursor: pointer;
  background: ${p => p.$active ? EUI.bgEmpty : "transparent"};
  color: ${p => p.$active ? EUI.primary : EUI.textSubdued};
  border-bottom: 2px solid ${p => p.$active ? EUI.primary : "transparent"};
`
const JsonBlock = styled.pre`
  margin: 0; padding: 16px 20px;
  background: ${EUI.bgDark}; color: ${EUI.codeGreen};
  font-size: 12px; line-height: 1.7;
  font-family: "SFMono-Regular", Consolas, monospace;
  overflow-x: auto;
`

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
