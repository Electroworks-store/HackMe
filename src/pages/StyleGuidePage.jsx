import { useState } from 'react'
import Button from '../components/ui/Button'
import Card, { CardHeader, CardBody, CardFooter } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Flag from '../components/ui/Flag'
import ProgressBar from '../components/ui/ProgressBar'
import Terminal from '../components/ui/Terminal'
import './StyleGuidePage.css'

function Section({ title, children }) {
  return (
    <section className="sg-section">
      <h2 className="sg-section-title">{title}</h2>
      {children}
    </section>
  )
}

function Row({ label, children }) {
  return (
    <div className="sg-row">
      {label && <span className="sg-label">{label}</span>}
      <div className="sg-row-items">{children}</div>
    </div>
  )
}

function Swatch({ token, value, isText }) {
  return (
    <div className="sg-swatch">
      <div
        className="sg-swatch-color"
        style={
          isText
            ? { background: 'var(--color-bg-elevated)', color: value }
            : { background: value }
        }
      >
        {isText ? 'Aa' : null}
      </div>
      <code className="sg-swatch-token">{token}</code>
      <span className="sg-swatch-value">{value}</span>
    </div>
  )
}

export default function StyleGuidePage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="sg-page container">
      <div className="sg-header">
        <h1>Design System</h1>
        <p className="sg-subtitle">
          Live preview of all design tokens and UI components. Edit a token in{' '}
          <code>src/index.css</code> or a component in{' '}
          <code>src/components/ui/</code> to see changes reflected here.
          See <code>DESIGN.md</code> for full documentation.
        </p>
      </div>

      {/* ── Colors ─────────────────────────────────────────── */}
      <Section title="Colors — Backgrounds">
        <div className="sg-swatches">
          <Swatch token="--color-bg-primary" value="#0a0e17" />
          <Swatch token="--color-bg-secondary" value="#131a2b" />
          <Swatch token="--color-bg-card" value="#1a2235" />
          <Swatch token="--color-bg-elevated" value="#222d42" />
        </div>
      </Section>

      <Section title="Colors — Accents">
        <div className="sg-swatches">
          <Swatch token="--color-accent-primary" value="#00ff88" />
          <Swatch token="--color-accent-secondary" value="#00d4ff" />
          <Swatch token="--color-accent-warning" value="#ff9f43" />
          <Swatch token="--color-accent-danger" value="#ff3366" />
          <Swatch token="--color-accent-purple" value="#a855f7" />
        </div>
      </Section>

      <Section title="Colors — Text">
        <div className="sg-swatches">
          <Swatch token="--color-text-primary" value="#e4e8f1" isText />
          <Swatch token="--color-text-secondary" value="#8892a8" isText />
          <Swatch token="--color-text-muted" value="#5a6478" isText />
          <Swatch token="--color-text-code" value="#00ff88" isText />
        </div>
      </Section>

      {/* ── Typography ─────────────────────────────────────── */}
      <Section title="Typography">
        <div className="sg-type-scale">
          <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 600 }}>text-4xl — Hero Heading</div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 600 }}>text-3xl — Page Title</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600 }}>text-2xl — Section Heading</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>text-xl — Sub-heading</div>
          <div style={{ fontSize: 'var(--text-lg)' }}>text-lg — Large Body</div>
          <div style={{ fontSize: 'var(--text-base)' }}>text-base — Body</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>text-sm — Secondary / Captions</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>text-xs — Fine Print / Labels</div>
        </div>
        <Row label="Monospace">
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--color-text-code)' }}>
            font-mono — FLAG&#123;example_string&#125;
          </code>
        </Row>
      </Section>

      {/* ── Button ─────────────────────────────────────────── */}
      <Section title="Button">
        <Row label="Variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="warning">Warning</Button>
        </Row>
        <Row label="Sizes">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </Row>
        <Row label="Disabled">
          <Button variant="primary" disabled>Primary</Button>
          <Button variant="secondary" disabled>Secondary</Button>
          <Button variant="danger" disabled>Danger</Button>
        </Row>
      </Section>

      {/* ── Badge ──────────────────────────────────────────── */}
      <Section title="Badge">
        <Row label="Variants">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </Row>
        <Row label="Difficulty">
          <Badge variant="beginner">Beginner</Badge>
          <Badge variant="intermediate">Intermediate</Badge>
          <Badge variant="advanced">Advanced</Badge>
          <Badge variant="hard">Hard</Badge>
        </Row>
        <Row label="Sizes">
          <Badge variant="primary" size="sm">Small</Badge>
          <Badge variant="primary" size="md">Medium</Badge>
          <Badge variant="primary" size="lg">Large</Badge>
        </Row>
      </Section>

      {/* ── Card ───────────────────────────────────────────── */}
      <Section title="Card">
        <div className="sg-cards">
          <Card variant="default">
            <CardHeader>Default Card</CardHeader>
            <CardBody>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Standard card used for most content panels.
              </p>
            </CardBody>
            <CardFooter>Footer</CardFooter>
          </Card>

          <Card variant="interactive">
            <CardHeader>Interactive Card</CardHeader>
            <CardBody>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Clickable card — hover to see the green glow.
              </p>
            </CardBody>
          </Card>

          <Card variant="success">
            <CardHeader>Success Card</CardHeader>
            <CardBody>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Used after a challenge is completed.
              </p>
            </CardBody>
          </Card>

          <Card variant="danger">
            <CardHeader>Danger Card</CardHeader>
            <CardBody>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Used for errors or destructive actions.
              </p>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* ── Progress Bar ───────────────────────────────────── */}
      <Section title="ProgressBar">
        <Row label="25%"><ProgressBar completed={5} total={20} /></Row>
        <Row label="50%"><ProgressBar completed={10} total={20} /></Row>
        <Row label="100%"><ProgressBar completed={20} total={20} /></Row>
      </Section>

      {/* ── Terminal ───────────────────────────────────────── */}
      <Section title="Terminal">
        <Terminal title="bash">
          {`$ nmap -sV target.example.com\nSTARTING NMAP...\nPORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.9\n80/tcp open  http    nginx 1.18`}
        </Terminal>
      </Section>

      {/* ── Flag ───────────────────────────────────────────── */}
      <Section title="Flag">
        <Flag flag="FLAG{this_is_a_sample_flag_12345}" title="Challenge Complete!" />
      </Section>

      {/* ── Modal ──────────────────────────────────────────── */}
      <Section title="Modal">
        <Row>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Open Modal
          </Button>
        </Row>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Example Modal"
        >
          <p>This is the modal body. It supports arbitrary JSX content.</p>
          <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
            Press <kbd>Escape</kbd> or click the overlay to close.
          </p>
        </Modal>
      </Section>

      {/* ── Spacing ────────────────────────────────────────── */}
      <Section title="Spacing Scale">
        <div className="sg-spacing">
          {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((n) => (
            <div key={n} className="sg-spacing-item">
              <div
                className="sg-spacing-block"
                style={{ width: `var(--space-${n})`, height: `var(--space-${n})` }}
              />
              <code className="sg-swatch-token">--space-{n}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Border Radius ──────────────────────────────────── */}
      <Section title="Border Radius">
        <div className="sg-radius">
          {[
            { token: '--radius-sm', value: '4px' },
            { token: '--radius-md', value: '8px' },
            { token: '--radius-lg', value: '12px' },
            { token: '--radius-xl', value: '16px' },
            { token: '--radius-full', value: '9999px' },
          ].map(({ token, value }) => (
            <div key={token} className="sg-radius-item">
              <div
                className="sg-radius-block"
                style={{ borderRadius: `var(${token})` }}
              />
              <code className="sg-swatch-token">{token}</code>
              <span className="sg-swatch-value">{value}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
