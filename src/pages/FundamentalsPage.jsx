import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Binary, 
  Code, 
  Palette, 
  Zap, 
  Server, 
  Terminal,
  ChevronRight,
  RotateCcw,
  Play,
  Monitor,
  Cloud,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Globe,
  Database,
  Cookie,
  HardDrive,
  Send,
  ArrowRight,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  AlertTriangle,
  Lock,
  Lightbulb,
  Layers,
  Layout,
  FileCode,
  Wifi,
  Activity,
  Settings,
  MousePointer,
  Eye,
  ChevronDown,
  Info
} from 'lucide-react'
import Button from '../components/ui/Button'
import './FundamentalsPage.css'

// ============================================
// Interactive Bit Flipper Component
// ============================================
function BitFlipper() {
  const [bits, setBits] = useState([0, 0, 0, 0, 0, 0, 0, 0])
  
  const toggleBit = (index) => {
    setBits(prev => {
      const newBits = [...prev]
      newBits[index] = newBits[index] === 0 ? 1 : 0
      return newBits
    })
  }
  
  const reset = () => setBits([0, 0, 0, 0, 0, 0, 0, 0])
  
  const decimalValue = bits.reduce((acc, bit, i) => acc + bit * Math.pow(2, 7 - i), 0)
  
  return (
    <div className="interactive-demo bit-flipper">
      <div className="demo-header">
        <h4>Try it: Flip the bits!</h4>
        <button className="reset-btn" onClick={reset}><RotateCcw size={14} /> Reset</button>
      </div>
      <div className="bits-container">
        {bits.map((bit, i) => (
          <button 
            key={i} 
            className={`bit ${bit === 1 ? 'on' : 'off'}`}
            onClick={() => toggleBit(i)}
          >
            {bit}
          </button>
        ))}
      </div>
      <div className="bit-labels">
        {[128, 64, 32, 16, 8, 4, 2, 1].map((val, i) => (
          <span key={i} className="bit-label">{val}</span>
        ))}
      </div>
      <div className="decimal-result">
        <span className="label">Decimal value:</span>
        <span className="value">{decimalValue}</span>
        {decimalValue >= 65 && decimalValue <= 90 && (
          <span className="ascii-char">= '{String.fromCharCode(decimalValue)}'</span>
        )}
        {decimalValue >= 97 && decimalValue <= 122 && (
          <span className="ascii-char">= '{String.fromCharCode(decimalValue)}'</span>
        )}
      </div>
    </div>
  )
}

// ============================================
// Interactive HTML Structure Builder
// ============================================
function HtmlStructureDemo() {
  const [blocks, setBlocks] = useState([
    { id: 'header', tag: 'header', label: 'Header', content: 'Site Navigation', comment: 'The top navigation area of the page' },
    { id: 'main', tag: 'main', label: 'Main Content', content: 'Welcome to my site!', comment: 'The primary content area' },
    { id: 'aside', tag: 'aside', label: 'Sidebar', content: 'Related Links', comment: 'Secondary content, like a sidebar' },
    { id: 'footer', tag: 'footer', label: 'Footer', content: '© 2025 HackLab', comment: 'Footer with copyright info' }
  ])

  const moveBlock = (index, direction) => {
    const newBlocks = [...blocks]
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= blocks.length) return
    
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[newIndex]
    newBlocks[newIndex] = temp
    setBlocks(newBlocks)
  }

  const reset = () => {
    setBlocks([
      { id: 'header', tag: 'header', label: 'Header', content: 'Site Navigation', comment: 'The top navigation area of the page' },
      { id: 'main', tag: 'main', label: 'Main Content', content: 'Welcome to my site!', comment: 'The primary content area' },
      { id: 'aside', tag: 'aside', label: 'Sidebar', content: 'Related Links', comment: 'Secondary content, like a sidebar' },
      { id: 'footer', tag: 'footer', label: 'Footer', content: '© 2025 HackLab', comment: 'Footer with copyright info' }
    ])
  }

  const generateHtml = () => {
    return blocks.map(block => 
      `  <!-- ${block.comment} -->\n  <${block.tag}>${block.content}</${block.tag}>`
    ).join('\n\n')
  }

  return (
    <div className="interactive-demo html-structure">
      <div className="demo-header">
        <h4>Try it: Reorder HTML elements</h4>
        <button className="reset-btn" onClick={reset}><RotateCcw size={14} /> Reset</button>
      </div>
      
      <div className="html-demo-layout">
        <div className="html-blocks-panel">
          <p className="panel-label">Drag to reorder:</p>
          <div className="html-blocks">
            {blocks.map((block, index) => (
              <div key={block.id} className={`html-block ${block.tag}`}>
                <div className="block-handle">
                  <GripVertical size={16} />
                </div>
                <div className="block-content">
                  <span className="block-tag">&lt;{block.tag}&gt;</span>
                  <span className="block-label">{block.label}</span>
                </div>
                <div className="block-controls">
                  <button 
                    className="move-btn"
                    onClick={() => moveBlock(index, -1)}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button 
                    className="move-btn"
                    onClick={() => moveBlock(index, 1)}
                    disabled={index === blocks.length - 1}
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="html-preview-panel">
          <p className="panel-label">Live Preview:</p>
          <div className="html-preview">
            {blocks.map(block => (
              <div key={block.id} className={`preview-element preview-${block.tag}`}>
                {block.content}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="html-code-panel">
        <p className="panel-label">Generated HTML:</p>
        <pre className="html-code">
{`<body>
${generateHtml()}
</body>`}
        </pre>
      </div>
    </div>
  )
}

// ============================================
// Interactive CSS Playground
// ============================================
function CssPlayground() {
  const [styles, setStyles] = useState({
    backgroundColor: '#00ff88',
    textColor: '#000000',
    borderRadius: 12,
    padding: 24,
    fontSize: 18
  })

  const reset = () => {
    setStyles({
      backgroundColor: '#00ff88',
      textColor: '#000000',
      borderRadius: 12,
      padding: 24,
      fontSize: 18
    })
  }

  const previewStyle = {
    backgroundColor: styles.backgroundColor,
    color: styles.textColor,
    borderRadius: `${styles.borderRadius}px`,
    padding: `${styles.padding}px`,
    fontSize: `${styles.fontSize}px`
  }

  const generateCss = () => {
    return `.card {
  background-color: ${styles.backgroundColor};
  color: ${styles.textColor};
  border-radius: ${styles.borderRadius}px;
  padding: ${styles.padding}px;
  font-size: ${styles.fontSize}px;
}`
  }

  return (
    <div className="interactive-demo css-playground">
      <div className="demo-header">
        <h4>Try it: Style a card with CSS</h4>
        <button className="reset-btn" onClick={reset}><RotateCcw size={14} /> Reset</button>
      </div>

      <div className="css-demo-layout">
        <div className="css-controls-panel">
          <div className="css-control color-control">
            <label>Background Color</label>
            <div className="color-input-group">
              <input 
                type="color" 
                value={styles.backgroundColor}
                onChange={(e) => setStyles(s => ({ ...s, backgroundColor: e.target.value }))}
              />
              <input 
                type="text" 
                value={styles.backgroundColor}
                onChange={(e) => setStyles(s => ({ ...s, backgroundColor: e.target.value }))}
                className="color-text-input"
              />
            </div>
          </div>

          <div className="css-control color-control">
            <label>Text Color</label>
            <div className="color-input-group">
              <input 
                type="color" 
                value={styles.textColor}
                onChange={(e) => setStyles(s => ({ ...s, textColor: e.target.value }))}
              />
              <input 
                type="text" 
                value={styles.textColor}
                onChange={(e) => setStyles(s => ({ ...s, textColor: e.target.value }))}
                className="color-text-input"
              />
            </div>
          </div>

          <div className="css-control slider-control">
            <label>Border Radius</label>
            <div className="slider-wrapper">
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={styles.borderRadius}
                onChange={(e) => setStyles(s => ({ ...s, borderRadius: parseInt(e.target.value) }))}
                style={{ '--range-progress': `${(styles.borderRadius / 50) * 100}%` }}
              />
              <span className="slider-value">{styles.borderRadius}px</span>
            </div>
          </div>

          <div className="css-control slider-control">
            <label>Padding</label>
            <div className="slider-wrapper">
              <input 
                type="range" 
                min="8" 
                max="48" 
                value={styles.padding}
                onChange={(e) => setStyles(s => ({ ...s, padding: parseInt(e.target.value) }))}
                style={{ '--range-progress': `${((styles.padding - 8) / 40) * 100}%` }}
              />
              <span className="slider-value">{styles.padding}px</span>
            </div>
          </div>

          <div className="css-control slider-control">
            <label>Font Size</label>
            <div className="slider-wrapper">
              <input 
                type="range" 
                min="12" 
                max="32" 
                value={styles.fontSize}
                onChange={(e) => setStyles(s => ({ ...s, fontSize: parseInt(e.target.value) }))}
                style={{ '--range-progress': `${((styles.fontSize - 12) / 20) * 100}%` }}
              />
              <span className="slider-value">{styles.fontSize}px</span>
            </div>
          </div>
        </div>

        <div className="css-preview-panel">
          <p className="panel-label">Live Preview:</p>
          <div className="css-preview-container">
            <div className="css-preview-card" style={previewStyle}>
              <h5>Styled Card</h5>
              <p>This card updates in real time as you adjust the CSS properties!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="css-code-panel">
        <p className="panel-label">Generated CSS:</p>
        <pre className="css-code">{generateCss()}</pre>
      </div>
    </div>
  )
}

// ============================================
// Interactive HTML/CSS/JS Demo - Now much more interesting!
// ============================================
function WebTrioDemo() {
  const [activeTab, setActiveTab] = useState('variables')
  const [name, setName] = useState('Hacker')
  const [age, setAge] = useState(25)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedElement, setSelectedElement] = useState(null)
  const [todoItems, setTodoItems] = useState(['Learn HTML', 'Master CSS'])
  const [newTodo, setNewTodo] = useState('')
  const [consoleOutput, setConsoleOutput] = useState([])
  const [liveCode, setLiveCode] = useState('')
  const [liveResult, setLiveResult] = useState('')
  const consoleIdRef = useRef(0)
  
  const addToConsole = (msg, type = 'log') => {
    consoleIdRef.current += 1
    setConsoleOutput(prev => [...prev, { msg, type, id: consoleIdRef.current }])
  }
  
  const clearConsole = () => {
    consoleIdRef.current = 0
    setConsoleOutput([])
  }
  
  // Tab explanations
  const tabExplanations = {
    variables: {
      title: 'Variables: Storing Data',
      description: 'Variables are containers for storing data values. JavaScript has three ways to declare variables:',
      bullets: [
        { code: 'let', text: '— Can be changed later (mutable)' },
        { code: 'const', text: '— Cannot be changed (immutable)' },
        { code: 'var', text: '— Old way, avoid in modern code' }
      ],
      tip: 'Try changing the values below and click "Run Code" to see how JavaScript processes them!'
    },
    dom: {
      title: 'DOM: Document Object Model',
      description: 'The DOM is how JavaScript "sees" a webpage. It represents HTML as a tree of objects you can read and modify.',
      bullets: [
        { code: 'document.querySelector()', text: '— Find one element' },
        { code: 'document.getElementById()', text: '— Find by ID' },
        { code: 'element.innerHTML', text: '— Get/set HTML content' }
      ],
      tip: 'Click on the elements below to see how JavaScript selects them!'
    },
    events: {
      title: 'Events: Reacting to User Actions',
      description: 'Events let JavaScript respond when users interact with your page.',
      bullets: [
        { code: 'click', text: '— When element is clicked' },
        { code: 'keydown', text: '— When key is pressed' },
        { code: 'submit', text: '— When form is submitted' }
      ],
      tip: 'Interact with the box below to see events fire in real-time!'
    },
    arrays: {
      title: 'Arrays: Lists of Data',
      description: 'Arrays store multiple values in a single variable. They are essential for working with lists of data.',
      bullets: [
        { code: 'array.push()', text: '— Add item to end' },
        { code: 'array.splice()', text: '— Remove item at index' },
        { code: 'array.length', text: '— Get number of items' }
      ],
      tip: 'Try adding and removing items to see array methods in action!'
    },
    sandbox: {
      title: 'JS Sandbox: Write Your Own Code',
      description: 'A safe space to experiment with JavaScript. Write code and see the results instantly!',
      bullets: [
        { code: 'console.log()', text: '— Print output to console' },
        { code: 'Math.random()', text: '— Generate random number' },
        { code: 'String methods', text: '— Manipulate text' }
      ],
      tip: 'Try the example codes or write your own JavaScript!'
    }
  }
  
  // Variables Demo
  const runVariablesDemo = () => {
    clearConsole()
    addToConsole(`// Declaring variables with let`, 'comment')
    addToConsole(`let name = "${name}"`, 'input')
    addToConsole(`let age = ${age}`, 'input')
    addToConsole(`let isAdmin = ${isAdmin}`, 'input')
    addToConsole('')
    addToConsole(`// Using variables in code`, 'comment')
    addToConsole(`console.log("Hello, " + name + "!")`, 'input')
    addToConsole(`"Hello, ${name}!"`, 'output')
    addToConsole('')
    addToConsole(`// Type checking`, 'comment')
    addToConsole(`typeof name  // "${typeof name}"`, 'output')
    addToConsole(`typeof age   // "${typeof age}"`, 'output')
    addToConsole(`typeof isAdmin // "${typeof isAdmin}"`, 'output')
    if (isAdmin) {
      addToConsole('')
      addToConsole('⚠️ Admin access detected! isAdmin === true', 'warning')
    }
  }
  
  // DOM Demo
  const domElements = [
    { id: 'title', tag: 'h1', content: 'Welcome!', class: 'title' },
    { id: 'subtitle', tag: 'p', content: 'Click elements to select them', class: 'subtitle' },
    { id: 'btn', tag: 'button', content: 'Click Me', class: 'action-btn' }
  ]
  
  const selectElement = (el) => {
    setSelectedElement(el)
    clearConsole()
    addToConsole(`// Selecting an element from the DOM`, 'comment')
    addToConsole(`const el = document.querySelector('.${el.class}')`, 'input')
    addToConsole('')
    addToConsole(`// Reading element properties`, 'comment')
    addToConsole(`el.textContent`, 'input')
    addToConsole(`"${el.content}"`, 'output')
    addToConsole(`el.tagName`, 'input')
    addToConsole(`"${el.tag.toUpperCase()}"`, 'output')
    addToConsole(`el.className`, 'input')
    addToConsole(`"${el.class}"`, 'output')
    addToConsole('')
    addToConsole(`// You can modify these properties!`, 'comment')
    addToConsole(`el.textContent = "New text"  // Changes text`, 'info')
    addToConsole(`el.style.color = "red"       // Changes color`, 'info')
  }
  
  // Events Demo
  const [eventLog, setEventLog] = useState([])
  const addEvent = (eventType) => {
    const entry = { type: eventType, time: new Date().toLocaleTimeString() }
    setEventLog(prev => [...prev.slice(-4), entry])
  }
  
  // Array Demo
  const addTodo = () => {
    if (newTodo.trim()) {
      clearConsole()
      addToConsole(`// Adding item to array`, 'comment')
      addToConsole(`todos.push("${newTodo}")`, 'input')
      addToConsole(`// Array length: ${todoItems.length} → ${todoItems.length + 1}`, 'output')
      setTodoItems(prev => [...prev, newTodo])
      setNewTodo('')
    }
  }
  
  const removeTodo = (index) => {
    clearConsole()
    addToConsole(`// Removing item from array`, 'comment')
    addToConsole(`todos.splice(${index}, 1)`, 'input')
    addToConsole(`// Removed: "${todoItems[index]}"`, 'output')
    addToConsole(`// Array length: ${todoItems.length} → ${todoItems.length - 1}`, 'output')
    setTodoItems(prev => prev.filter((_, i) => i !== index))
  }
  
  // Sandbox Demo
  const sandboxExamples = [
    { name: 'Hello World', code: 'console.log("Hello, World!")' },
    { name: 'Math', code: 'let result = 5 + 10 * 2\nconsole.log("Result:", result)' },
    { name: 'Random', code: 'let random = Math.floor(Math.random() * 100)\nconsole.log("Random number:", random)' },
    { name: 'String', code: 'let text = "hacklab"\nconsole.log(text.toUpperCase())\nconsole.log(text.length)' },
    { name: 'Loop', code: 'for (let i = 1; i <= 5; i++) {\n  console.log("Count:", i)\n}' }
  ]
  
  const runSandboxCode = () => {
    clearConsole()
    if (!liveCode.trim()) {
      addToConsole('// Write some code first!', 'comment')
      return
    }
    
    // Create safe eval environment
    const logs = []
    const safeConsole = {
      log: (...args) => logs.push({ type: 'output', msg: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') })
    }
    
    try {
      // Show the code being run
      liveCode.split('\n').forEach(line => {
        if (line.trim()) addToConsole(line.trim(), 'input')
      })
      addToConsole('')
      
      // eslint-disable-next-line no-new-func
      const fn = new Function('console', liveCode)
      fn(safeConsole)
      
      logs.forEach(log => addToConsole(log.msg, log.type))
      if (logs.length === 0) {
        addToConsole('// Code executed (no console.log output)', 'comment')
      }
    } catch (err) {
      addToConsole(`Error: ${err.message}`, 'error')
    }
  }
  
  const resetAll = () => {
    setName('Hacker')
    setAge(25)
    setIsAdmin(false)
    setSelectedElement(null)
    setTodoItems(['Learn HTML', 'Master CSS'])
    setNewTodo('')
    setConsoleOutput([])
    setEventLog([])
    setLiveCode('')
    setLiveResult('')
  }

  const currentExplanation = tabExplanations[activeTab]
  
  return (
    <div className="interactive-demo js-playground">
      <div className="demo-header">
        <h4>JavaScript Playground</h4>
        <button className="reset-btn" onClick={resetAll}><RotateCcw size={14} /> Reset All</button>
      </div>
      
      <div className="js-tabs">
        <button 
          className={`js-tab ${activeTab === 'variables' ? 'active' : ''}`}
          onClick={() => { setActiveTab('variables'); clearConsole(); }}
        >
          Variables
        </button>
        <button 
          className={`js-tab ${activeTab === 'dom' ? 'active' : ''}`}
          onClick={() => { setActiveTab('dom'); clearConsole(); }}
        >
          DOM Selection
        </button>
        <button 
          className={`js-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => { setActiveTab('events'); clearConsole(); }}
        >
          Events
        </button>
        <button 
          className={`js-tab ${activeTab === 'arrays' ? 'active' : ''}`}
          onClick={() => { setActiveTab('arrays'); clearConsole(); }}
        >
          Arrays
        </button>
        <button 
          className={`js-tab ${activeTab === 'sandbox' ? 'active' : ''}`}
          onClick={() => { setActiveTab('sandbox'); clearConsole(); }}
        >
          <Code size={14} /> Sandbox
        </button>
      </div>
      
      {/* Tab Explanation Box */}
      <div className="js-explanation-box">
        <h5>{currentExplanation.title}</h5>
        <p>{currentExplanation.description}</p>
        <div className="explanation-bullets">
          {currentExplanation.bullets.map((b, i) => (
            <div key={i} className="explanation-bullet">
              <code>{b.code}</code>
              <span>{b.text}</span>
            </div>
          ))}
        </div>
        <div className="explanation-tip">
          <Lightbulb size={14} />
          <span>{currentExplanation.tip}</span>
        </div>
      </div>
      
      <div className="js-demo-content">
        {/* Variables Tab */}
        {activeTab === 'variables' && (
          <div className="js-variables-demo">
            <div className="variable-inputs">
              <div className="var-input">
                <label>let name =</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="your name"
                />
                <span className="type-badge string">string</span>
              </div>
              <div className="var-input">
                <label>let age =</label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                />
                <span className="type-badge number">number</span>
              </div>
              <div className="var-input checkbox">
                <label>let isAdmin =</label>
                <button 
                  className={`bool-toggle ${isAdmin ? 'true' : 'false'}`}
                  onClick={() => setIsAdmin(!isAdmin)}
                >
                  {isAdmin ? 'true' : 'false'}
                </button>
                <span className="type-badge boolean">boolean</span>
              </div>
            </div>
            <button className="run-btn" onClick={runVariablesDemo}>
              <Play size={14} /> Run Code
            </button>
          </div>
        )}
        
        {/* DOM Tab */}
        {activeTab === 'dom' && (
          <div className="js-dom-demo">
            <p className="demo-instruction">Click on elements below to see how JavaScript selects them:</p>
            <div className="dom-preview">
              {domElements.map(el => (
                <div 
                  key={el.id}
                  className={`dom-element ${selectedElement?.id === el.id ? 'selected' : ''}`}
                  onClick={() => selectElement(el)}
                >
                  <span className="tag-marker">&lt;{el.tag}&gt;</span>
                  {el.content}
                </div>
              ))}
            </div>
            {selectedElement && (
              <div className="selection-info">
                <Check size={14} /> Selected: <code>document.querySelector('.{selectedElement.class}')</code>
              </div>
            )}
          </div>
        )}
        
        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="js-events-demo">
            <p className="demo-instruction">Interact with the box to see events fire in real-time:</p>
            <div 
              className="event-target"
              onClick={() => addEvent('click')}
              onMouseEnter={() => addEvent('mouseenter')}
              onMouseLeave={() => addEvent('mouseleave')}
              onDoubleClick={() => addEvent('dblclick')}
            >
              <span>Hover, Click, or Double-Click me!</span>
            </div>
            <div className="event-log">
              <div className="log-header">Event Log:</div>
              {eventLog.length === 0 ? (
                <div className="log-empty">No events yet... interact with the box above!</div>
              ) : (
                eventLog.map((e, i) => (
                  <div key={i} className={`event-entry ${e.type}`}>
                    <span className="event-type">on{e.type}</span>
                    <span className="event-time">{e.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Arrays Tab */}
        {activeTab === 'arrays' && (
          <div className="js-arrays-demo">
            <div className="array-visual">
              <span className="array-label">let todos = </span>
              <span className="array-bracket">[</span>
              {todoItems.map((item, i) => (
                <span key={i} className="array-item">
                  "{item}"
                  <button className="remove-item" onClick={() => removeTodo(i)} title="Remove item">
                    <X size={12} />
                  </button>
                  {i < todoItems.length - 1 && <span className="comma">,</span>}
                </span>
              ))}
              <span className="array-bracket">]</span>
            </div>
            <div className="array-controls">
              <input 
                type="text" 
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="New item..."
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              />
              <button className="add-btn" onClick={addTodo}>
                <Plus size={14} /> Push
              </button>
            </div>
            <div className="array-info">
              <code>todos.length = {todoItems.length}</code>
            </div>
          </div>
        )}
        
        {/* Sandbox Tab */}
        {activeTab === 'sandbox' && (
          <div className="js-sandbox-demo">
            <div className="sandbox-examples">
              <span className="examples-label">Examples:</span>
              {sandboxExamples.map((ex, i) => (
                <button 
                  key={i} 
                  className="example-btn"
                  onClick={() => setLiveCode(ex.code)}
                >
                  {ex.name}
                </button>
              ))}
            </div>
            <div className="sandbox-editor">
              <textarea
                value={liveCode}
                onChange={(e) => setLiveCode(e.target.value)}
                placeholder="// Write your JavaScript here...&#10;console.log('Hello!')"
                spellCheck="false"
              />
            </div>
            <button className="run-btn sandbox-run" onClick={runSandboxCode}>
              <Play size={14} /> Run Code
            </button>
          </div>
        )}
        
        {/* Console Output */}
        <div className="js-console">
          <div className="console-header">
            <Terminal size={14} />
            <span>Console Output</span>
            {consoleOutput.length > 0 && (
              <button className="clear-console" onClick={clearConsole}>Clear</button>
            )}
          </div>
          <div className="console-body">
            {consoleOutput.length === 0 ? (
              <div className="console-empty-msg">
                {activeTab === 'sandbox' 
                  ? 'Write code and click "Run Code" to see output...'
                  : 'Interact with the demo above to see output...'}
              </div>
            ) : (
              consoleOutput.map(line => (
                <div key={line.id} className={`console-line ${line.type}`}>
                  {line.type === 'input' && <span className="prompt">&gt;</span>}
                  {line.type === 'output' && <span className="prompt">←</span>}
                  {line.type === 'comment' && <span className="prompt">//</span>}
                  {line.type === 'error' && <span className="prompt">✖</span>}
                  {line.type === 'warning' && <span className="prompt">⚠</span>}
                  {line.type === 'info' && <span className="prompt">ℹ</span>}
                  <span className="console-msg">{line.msg}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// NEW: Network Request Simulator
// ============================================
function NetworkingDemo() {
  const [method, setMethod] = useState('GET')
  const [endpoint, setEndpoint] = useState('/')
  const [step, setStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const endpoints = [
    { path: '/', name: 'Home Page' },
    { path: '/profile', name: 'User Profile' },
    { path: '/login', name: 'Login Page' },
    { path: '/api/data', name: 'API Data' }
  ]

  const steps = [
    { label: 'Ready', description: 'Click "Send Request" to start the simulation.' },
    { label: 'Sending Request', description: `Your browser is sending a ${method} request to ${endpoint}...` },
    { label: 'Server Processing', description: 'The server received your request and is processing it...' },
    { label: 'Sending Response', description: 'The server is sending back HTML, CSS, and data...' },
    { label: 'Complete', description: 'Your browser received the response and displays the page!' }
  ]

  const getResponseContent = () => {
    if (endpoint === '/api/data') {
      return `{"user": "guest", "status": "ok"}`
    }
    return `<!DOCTYPE html>
<html>
  <head><title>Page</title></head>
  <body>Content here</body>
</html>`
  }

  const getContentType = () => {
    return endpoint === '/api/data' ? 'application/json' : 'text/html'
  }

  const runSimulation = () => {
    if (isRunning) return
    setIsRunning(true)
    setStep(1)
    
    setTimeout(() => setStep(2), 800)
    setTimeout(() => setStep(3), 1600)
    setTimeout(() => setStep(4), 2400)
    setTimeout(() => {
      setIsRunning(false)
    }, 3200)
  }

  const reset = () => {
    setStep(0)
    setIsRunning(false)
  }

  return (
    <div className="interactive-demo networking-demo">
      <div className="demo-header">
        <h4>Try it: Web Request Simulator</h4>
        <button className="reset-btn" onClick={reset}><RotateCcw size={14} /> Reset</button>
      </div>

      {/* Request Builder */}
      <div className="request-builder">
        <div className="builder-section">
          <label>Request Method:</label>
          <div className="method-buttons">
            <button 
              className={`method-btn ${method === 'GET' ? 'active' : ''}`}
              onClick={() => setMethod('GET')}
            >
              GET
            </button>
            <button 
              className={`method-btn ${method === 'POST' ? 'active' : ''}`}
              onClick={() => setMethod('POST')}
            >
              POST
            </button>
          </div>
          <p className="method-hint">
            {method === 'GET' 
              ? 'GET: Fetch data from the server (loading a page)' 
              : 'POST: Send data to the server (submitting a form)'}
          </p>
        </div>

        <div className="builder-section">
          <label>Target Endpoint:</label>
          <div className="endpoint-buttons">
            {endpoints.map(ep => (
              <button 
                key={ep.path}
                className={`endpoint-btn ${endpoint === ep.path ? 'active' : ''}`}
                onClick={() => setEndpoint(ep.path)}
              >
                {ep.path}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Flow */}
      <div className="network-flow">
        <div className={`flow-box browser ${step >= 1 ? 'active' : ''}`}>
          <Monitor size={28} />
          <span>Browser</span>
          <small>Your Computer</small>
        </div>

        <div className="flow-arrows">
          <div className={`arrow-line request ${step === 1 ? 'animating' : ''}`}>
            <ArrowRight size={20} />
            <span>Request</span>
            {step === 1 && <div className="packet-animation">📦</div>}
          </div>
          <div className={`arrow-line response ${step === 3 ? 'animating' : ''}`}>
            <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
            <span>Response</span>
            {step === 3 && <div className="packet-animation reverse">📄</div>}
          </div>
        </div>

        <div className={`flow-box server ${step >= 2 && step <= 3 ? 'active' : ''}`}>
          <Cloud size={28} />
          <span>Server</span>
          <small>Remote Computer</small>
        </div>
      </div>

      {/* Status Message */}
      <div className={`status-message step-${step}`}>
        <div className="status-label">{steps[step].label}</div>
        <div className="status-desc">{steps[step].description}</div>
      </div>

      {/* Request/Response Preview */}
      <div className="http-preview">
        <div className="preview-panel request-preview">
          <h5>Request Preview</h5>
          <pre className="http-code">
{`${method} ${endpoint} HTTP/1.1
Host: hackme.lab
User-Agent: Browser/1.0
Accept: text/html${method === 'POST' ? '\nContent-Type: application/x-www-form-urlencoded\n\nusername=guest&action=login' : ''}`}
          </pre>
        </div>

        <div className="preview-panel response-preview">
          <h5>Response Preview</h5>
          <pre className="http-code">
{`HTTP/1.1 200 OK
Content-Type: ${getContentType()}
Server: HackLab/1.0

${getResponseContent()}`}
          </pre>
        </div>
      </div>

      {/* Send Button */}
      <div className="demo-actions">
        <button 
          className="send-request-btn"
          onClick={runSimulation}
          disabled={isRunning}
        >
          <Send size={16} />
          {isRunning ? 'Sending...' : 'Send Request'}
        </button>
      </div>
    </div>
  )
}

// ============================================
// NEW: Cookies and Storage Playground
// ============================================
function StoragePlayground() {
  // Simulated cookie store (NOT real cookies)
  const [cookies, setCookies] = useState([
    { key: 'session_id', value: 'abc123xyz', editable: false },
    { key: 'role', value: 'user', editable: true },
    { key: 'theme', value: 'dark', editable: true }
  ])

  // Simulated localStorage (NOT real localStorage)
  const [storage, setStorage] = useState([
    { key: 'tutorialCompleted', value: 'false', editable: true },
    { key: 'username', value: 'guest', editable: true }
  ])

  const [editingCookie, setEditingCookie] = useState(null)
  const [editingStorage, setEditingStorage] = useState(null)
  const [newCookieKey, setNewCookieKey] = useState('')
  const [newCookieValue, setNewCookieValue] = useState('')
  const [newStorageKey, setNewStorageKey] = useState('')
  const [newStorageValue, setNewStorageValue] = useState('')
  const [securityWarning, setSecurityWarning] = useState(null)

  // Check for security-relevant changes
  const checkSecurityWarning = (key, newValue, oldValue) => {
    if (key === 'role' && oldValue === 'user' && newValue === 'admin') {
      setSecurityWarning({
        type: 'danger',
        message: 'You changed your role from "user" to "admin"! In poorly designed apps, this kind of client side change could grant unauthorized access. This is why servers must always verify permissions on their end.'
      })
      setTimeout(() => setSecurityWarning(null), 8000)
    } else if (key === 'session_id') {
      setSecurityWarning({
        type: 'warning',
        message: 'Session IDs are sensitive! If an attacker steals your session cookie, they can impersonate you. This is called session hijacking.'
      })
      setTimeout(() => setSecurityWarning(null), 6000)
    }
  }

  // Cookie operations
  const updateCookie = (index, newValue) => {
    const oldValue = cookies[index].value
    const key = cookies[index].key
    setCookies(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], value: newValue }
      return updated
    })
    checkSecurityWarning(key, newValue, oldValue)
    setEditingCookie(null)
  }

  const deleteCookie = (index) => {
    setCookies(prev => prev.filter((_, i) => i !== index))
  }

  const addCookie = () => {
    if (newCookieKey.trim() && newCookieValue.trim()) {
      setCookies(prev => [...prev, { key: newCookieKey.trim(), value: newCookieValue.trim(), editable: true }])
      setNewCookieKey('')
      setNewCookieValue('')
    }
  }

  // Storage operations
  const updateStorage = (index, newValue) => {
    setStorage(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], value: newValue }
      return updated
    })
    setEditingStorage(null)
  }

  const deleteStorage = (index) => {
    setStorage(prev => prev.filter((_, i) => i !== index))
  }

  const addStorage = () => {
    if (newStorageKey.trim() && newStorageValue.trim()) {
      setStorage(prev => [...prev, { key: newStorageKey.trim(), value: newStorageValue.trim(), editable: true }])
      setNewStorageKey('')
      setNewStorageValue('')
    }
  }

  const reset = () => {
    setCookies([
      { key: 'session_id', value: 'abc123xyz', editable: false },
      { key: 'role', value: 'user', editable: true },
      { key: 'theme', value: 'dark', editable: true }
    ])
    setStorage([
      { key: 'tutorialCompleted', value: 'false', editable: true },
      { key: 'username', value: 'guest', editable: true }
    ])
    setSecurityWarning(null)
    setEditingCookie(null)
    setEditingStorage(null)
  }

  return (
    <div className="interactive-demo storage-playground">
      <div className="demo-header">
        <h4>Try it: Browser Storage Playground</h4>
        <button className="reset-btn" onClick={reset}><RotateCcw size={14} /> Reset</button>
      </div>

      <p className="playground-note">
        This is a simulation. Changes here do not affect your real browser storage.
      </p>

      {/* Security Warning */}
      {securityWarning && (
        <div className={`security-warning ${securityWarning.type}`}>
          <AlertTriangle size={18} />
          <p>{securityWarning.message}</p>
        </div>
      )}

      <div className="storage-panels">
        {/* Cookies Panel */}
        <div className="storage-panel cookies-panel">
          <div className="panel-header">
            <Cookie size={18} />
            <h5>Cookies</h5>
          </div>
          <p className="panel-desc">Sent to the server with every request</p>

          <div className="storage-entries">
            {cookies.map((cookie, index) => (
              <div key={index} className="storage-entry">
                <span className="entry-key">{cookie.key}</span>
                <span className="entry-separator">=</span>
                {editingCookie === index ? (
                  <input
                    type="text"
                    className="entry-edit-input"
                    defaultValue={cookie.value}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateCookie(index, e.target.value)
                      if (e.key === 'Escape') setEditingCookie(null)
                    }}
                    onBlur={(e) => updateCookie(index, e.target.value)}
                  />
                ) : (
                  <span className="entry-value">{cookie.value}</span>
                )}
                <div className="entry-actions">
                  {cookie.editable && (
                    <>
                      <button 
                        className="entry-btn edit"
                        onClick={() => setEditingCookie(index)}
                        title="Edit"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button 
                        className="entry-btn delete"
                        onClick={() => deleteCookie(index)}
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                  {!cookie.editable && (
                    <Lock size={12} className="locked-icon" title="Protected" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="add-entry">
            <input
              type="text"
              placeholder="Key"
              value={newCookieKey}
              onChange={(e) => setNewCookieKey(e.target.value)}
            />
            <input
              type="text"
              placeholder="Value"
              value={newCookieValue}
              onChange={(e) => setNewCookieValue(e.target.value)}
            />
            <button className="add-btn" onClick={addCookie}>
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* LocalStorage Panel */}
        <div className="storage-panel localstorage-panel">
          <div className="panel-header">
            <HardDrive size={18} />
            <h5>LocalStorage</h5>
          </div>
          <p className="panel-desc">Stays in browser, not sent to server</p>

          <div className="storage-entries">
            {storage.map((item, index) => (
              <div key={index} className="storage-entry">
                <span className="entry-key">{item.key}</span>
                <span className="entry-separator">=</span>
                {editingStorage === index ? (
                  <input
                    type="text"
                    className="entry-edit-input"
                    defaultValue={item.value}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateStorage(index, e.target.value)
                      if (e.key === 'Escape') setEditingStorage(null)
                    }}
                    onBlur={(e) => updateStorage(index, e.target.value)}
                  />
                ) : (
                  <span className="entry-value">{item.value}</span>
                )}
                <div className="entry-actions">
                  <button 
                    className="entry-btn edit"
                    onClick={() => setEditingStorage(index)}
                    title="Edit"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button 
                    className="entry-btn delete"
                    onClick={() => deleteStorage(index)}
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="add-entry">
            <input
              type="text"
              placeholder="Key"
              value={newStorageKey}
              onChange={(e) => setNewStorageKey(e.target.value)}
            />
            <input
              type="text"
              placeholder="Value"
              value={newStorageValue}
              onChange={(e) => setNewStorageValue(e.target.value)}
            />
            <button className="add-btn" onClick={addStorage}>
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Session Diagram */}
      <div className="session-diagram">
        <h5>How Sessions Work</h5>
        <div className="session-flow">
          <div className="session-step">
            <div className="step-icon browser-icon">
              <Monitor size={20} />
            </div>
            <div className="step-content">
              <strong>Browser</strong>
              <code>Cookie: session_id=abc123</code>
            </div>
          </div>
          <div className="session-arrow">
            <ArrowRight size={16} />
          </div>
          <div className="session-step">
            <div className="step-icon server-icon">
              <Server size={20} />
            </div>
            <div className="step-content">
              <strong>Server</strong>
              <span>Looks up session_id in database</span>
            </div>
          </div>
          <div className="session-arrow">
            <ArrowRight size={16} />
          </div>
          <div className="session-step">
            <div className="step-icon db-icon">
              <Database size={20} />
            </div>
            <div className="step-content">
              <strong>Session Store</strong>
              <code>abc123 → user: "you"</code>
            </div>
          </div>
        </div>
        <p className="session-note">
          The server uses your session ID to remember who you are between requests.
        </p>
      </div>
    </div>
  )
}

// ============================================
// Interactive Terminal
// ============================================
function InteractiveTerminal() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([
    { type: 'system', text: '┌─────────────────────────────────────────────────────────────┐' },
    { type: 'system', text: '│  HackLab Terminal v1.0.0                                    │' },
    { type: 'system', text: '│  A safe sandbox to practice terminal commands               │' },
    { type: 'system', text: '│  Linux-style environment simulated in your browser          │' },
    { type: 'system', text: '└─────────────────────────────────────────────────────────────┘' },
    { type: 'output', text: '' },
    { type: 'output', text: 'Last login: ' + new Date().toDateString() + ' on tty1' },
    { type: 'output', text: '' },
    { type: 'output', text: 'Type "help" to see available commands.' }
  ])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalBodyRef = useRef(null)
  const inputRef = useRef(null)
  
  const commands = {
    help: () => `
┌─────────────────────────────────────────────────────────────┐
│                    AVAILABLE COMMANDS                       │
├─────────────────────────────────────────────────────────────┤
│  help        Show this help message                         │
│  whoami      Display current user                           │
│  date        Show current date and time                     │
│  ls          List files in current directory                │
│  ls -la      List files with details                        │
│  pwd         Print working directory                        │
│  cd          Change directory (try: cd documents)           │
│  cat         Read a file (try: cat secrets.txt)             │
│  echo        Print a message (try: echo hello)              │
│  clear       Clear the terminal screen                      │
│  history     Show command history                           │
│  uname       Display system information                     │
│  neofetch    Display system info with ASCII art             │
│  hack        Try to hack the system                         │
└─────────────────────────────────────────────────────────────┘`,
    whoami: () => 'guest',
    date: () => new Date().toString(),
    pwd: () => '/home/guest',
    ls: () => `documents  downloads  secrets.txt  notes.md  readme.txt`,
    'ls -la': () => `total 24
drwxr-xr-x  4 guest guest 4096 ${new Date().toLocaleDateString()} .
drwxr-xr-x  3 root  root  4096 ${new Date().toLocaleDateString()} ..
-rw-r--r--  1 guest guest  220 ${new Date().toLocaleDateString()} .bashrc
drwxr-xr-x  2 guest guest 4096 ${new Date().toLocaleDateString()} documents
drwxr-xr-x  2 guest guest 4096 ${new Date().toLocaleDateString()} downloads
-rw-r--r--  1 guest guest  156 ${new Date().toLocaleDateString()} secrets.txt
-rw-r--r--  1 guest guest   89 ${new Date().toLocaleDateString()} notes.md
-rw-r--r--  1 guest guest  234 ${new Date().toLocaleDateString()} readme.txt`,
    'ls -l': () => commands['ls -la'](),
    cat: () => `Usage: cat <filename>
Try: cat secrets.txt, cat notes.md, or cat readme.txt`,
    'cat secrets.txt': () => `╔═══════════════════════════════════════════════════════════╗
║                   CLASSIFIED FILE                         ║
╚═══════════════════════════════════════════════════════════╝

FLAG{Y0U_F0UND_TH3_S3CR3T_F1L3}

Congratulations! You found the hidden flag.

In real security testing, finding hidden or sensitive files
is a common way to discover confidential information.
Always secure your sensitive data!`,
    'cat notes.md': () => `# Security Notes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Learn about common vulnerabilities
• Practice in safe environments only
• Never hack without explicit permission
• Stay curious and keep learning!`,
    'cat readme.txt': () => `Welcome to HackLab Terminal!
═════════════════════════════

This is a safe, sandboxed terminal simulation
running in your browser. You can practice basic
Linux commands without any risk to real systems.

Explore with: ls, cat, pwd, whoami
Have fun learning!`,
    'cat .bashrc': () => `# ~/.bashrc: executed by bash for non-login shells

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# Secret alias - you found it!
alias hack="echo 'Nice try!'"

export PS1='\\u@hacklab:\\w\\$ '`,
    clear: () => 'CLEAR',
    uname: () => 'Linux hacklab 5.15.0-hacklab x86_64 GNU/Linux',
    'uname -a': () => `Linux hacklab 5.15.0-hacklab #1 SMP HackLab ${new Date().toDateString()} x86_64 GNU/Linux`,
    neofetch: () => `
       .--.          guest@hacklab
      |o_o |         ─────────────
      |:_/ |         OS: HackLab Linux x86_64
     //   \\ \\        Host: Web Browser
    (|     | )       Kernel: 5.15.0-hacklab
   /'\\_   _/\`\\       Uptime: Since you opened this page
   \\___)=(___/       Shell: bash 5.1.16
                     Terminal: HackLab Terminal v1.0
                     CPU: Your Brain @ ∞GHz
                     Memory: Unlimited Learning
`,
    hack: () => `
  ██╗  ██╗ █████╗  ██████╗██╗  ██╗██╗
  ██║  ██║██╔══██╗██╔════╝██║ ██╔╝██║
  ███████║███████║██║     █████╔╝ ██║
  ██╔══██║██╔══██║██║     ██╔═██╗ ╚═╝
  ██║  ██║██║  ██║╚██████╗██║  ██╗██╗
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝

Nice try! Real hacking requires knowledge,
patience, and ethics. But curiosity is the
first step to becoming a security expert!

Try the challenges to learn real techniques.`,
    cd: () => `Usage: cd <directory>
Available directories: documents, downloads`,
    'cd documents': () => '(Would change to /home/guest/documents)',
    'cd downloads': () => '(Would change to /home/guest/downloads)',
    'cd ..': () => '(Would change to /home)',
    'cd ~': () => '(Would change to /home/guest)',
    '': () => ''
  }

  // Add history command dynamically
  const getHistoryOutput = () => {
    return commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`).join('\n') || 'No commands in history'
  }

  const processCommand = (cmd) => {
    if (cmd === 'history') {
      return getHistoryOutput
    }
    if (cmd.startsWith('echo ')) {
      return cmd.substring(5)
    }
    return commands[cmd] || commands[cmd.split(' ')[0]] || null
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const cmd = input.trim().toLowerCase()
    
    if (!cmd) {
      setInput('')
      return
    }

    setCommandHistory(prev => [...prev, input])
    setHistoryIndex(-1)
    
    const newHistory = [...history, { type: 'input', text: `guest@hacklab:~$ ${input}` }]
    
    if (cmd === 'clear') {
      setHistory([
        { type: 'output', text: 'Terminal cleared.' },
        { type: 'output', text: '' },
        { type: 'output', text: 'Type "help" to see available commands.' }
      ])
    } else {
      const response = processCommand(cmd)
      if (response) {
        const result = typeof response === 'function' ? response() : response
        newHistory.push({ type: 'output', text: result })
      } else {
        newHistory.push({ type: 'error', text: `bash: ${cmd}: command not found\nType "help" for available commands.` })
      }
      setHistory(newHistory)
    }
    
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      } else {
        setHistoryIndex(-1)
        setInput('')
      }
    }
  }

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [history])

  const focusInput = () => {
    inputRef.current?.focus()
  }
  
  return (
    <div className="interactive-demo interactive-terminal">
      <div className="terminal-window-large" onClick={focusInput}>
        <div className="terminal-header-large">
          <div className="terminal-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <span className="terminal-title-large">guest@hacklab:~</span>
          <div className="terminal-actions">
            <button 
              className="terminal-clear-btn"
              onClick={(e) => {
                e.stopPropagation()
                setHistory([
                  { type: 'output', text: 'Terminal cleared.' },
                  { type: 'output', text: '' },
                  { type: 'output', text: 'Type "help" to see available commands.' }
                ])
              }}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="terminal-body-large" ref={terminalBodyRef}>
          {history.map((line, i) => (
            <div key={i} className={`terminal-line-large ${line.type}`}>
              <pre>{line.text}</pre>
            </div>
          ))}
          <form onSubmit={handleSubmit} className="terminal-input-line-large">
            <span className="prompt-large">guest@hacklab:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
          </form>
        </div>
      </div>
      
      <div className="terminal-hints">
        <p><strong>Quick Commands</strong> - Click to insert:</p>
        <div className="hint-commands">
          <code onClick={() => setInput('help')}>help</code>
          <code onClick={() => setInput('ls -la')}>ls -la</code>
          <code onClick={() => setInput('whoami')}>whoami</code>
          <code onClick={() => setInput('cat secrets.txt')}>cat secrets.txt</code>
          <code onClick={() => setInput('pwd')}>pwd</code>
          <code onClick={() => setInput('history')}>history</code>
        </div>
        <p className="hint-tip">Use ↑/↓ arrow keys to navigate command history</p>
      </div>
    </div>
  )
}

// ============================================
// Client vs Server Visualization
// ============================================
function ClientServerDemo() {
  const [step, setStep] = useState(0)
  
  const steps = [
    { client: 'idle', server: 'idle', message: 'Click "Send Request" to see how client and server communicate.' },
    { client: 'sending', server: 'idle', message: '1. Your browser (client) sends an HTTP request to the server...' },
    { client: 'waiting', server: 'processing', message: '2. The server receives and processes the request...' },
    { client: 'receiving', server: 'responding', message: '3. The server sends back a response (HTML, JSON, etc.)...' },
    { client: 'done', server: 'idle', message: '4. Your browser renders the response. Done!' }
  ]
  
  const runAnimation = () => {
    setStep(1)
    setTimeout(() => setStep(2), 1000)
    setTimeout(() => setStep(3), 2000)
    setTimeout(() => setStep(4), 3000)
    setTimeout(() => setStep(0), 5000)
  }
  
  const current = steps[step]
  
  return (
    <div className="interactive-demo client-server">
      <div className="demo-header">
        <h4>How client and server communicate</h4>
        <button 
          className="play-btn" 
          onClick={runAnimation}
          disabled={step > 0}
        >
          <Play size={14} /> {step > 0 ? 'Running...' : 'Send Request'}
        </button>
      </div>
      
      <div className="cs-visualization">
        <div className={`cs-box client ${current.client}`}>
          <Monitor size={32} />
          <span>Client</span>
          <small>(Your Browser)</small>
        </div>
        
        <div className="cs-connection">
          <div className={`cs-arrow ${step >= 1 && step < 3 ? 'active-right' : ''}`}>
            <span>→</span>
            {step === 1 && <span className="packet request-packet"></span>}
          </div>
          <div className={`cs-arrow ${step >= 3 ? 'active-left' : ''}`}>
            <span>←</span>
            {step === 3 && <span className="packet response-packet"></span>}
          </div>
        </div>
        
        <div className={`cs-box server ${current.server}`}>
          <Cloud size={32} />
          <span>Server</span>
          <small>(Remote Computer)</small>
        </div>
      </div>
      
      <div className="cs-message">
        <p>{current.message}</p>
      </div>
    </div>
  )
}

// ============================================
// DevTools Explorer Demo
// ============================================
function DevToolsDemo() {
  const [activePanel, setActivePanel] = useState(null)
  
  const panels = [
    { 
      id: 'elements', 
      icon: Code, 
      name: 'Elements',
      description: 'Inspect and modify the HTML structure of any webpage. You can see the DOM tree, edit HTML in real-time, and see how changes affect the page instantly.',
      tips: [
        'Right-click any element → "Inspect" to jump straight to it',
        'Double-click text in Elements to edit it live',
        'Use the selector tool (top-left) to click and find elements',
        'Changes you make here are temporary - refresh to reset'
      ],
      securityUse: 'Find hidden form fields, discover commented-out features, modify client-side validation'
    },
    { 
      id: 'console', 
      icon: Terminal, 
      name: 'Console',
      description: 'Run JavaScript code directly in the page context. You can access variables, call functions, and manipulate the page programmatically.',
      tips: [
        'Type any JavaScript and press Enter to execute',
        'Use console.log() to debug your code',
        'Access global variables and functions from the page',
        'Use $0 to reference the currently selected element in Elements tab'
      ],
      securityUse: 'Call hidden functions, modify variables, bypass client-side checks, explore the window object'
    },
    { 
      id: 'network', 
      icon: Wifi, 
      name: 'Network',
      description: 'See every request your browser makes - HTML, CSS, JS, images, API calls, and more. Monitor what data is being sent and received.',
      tips: [
        'Filter by type: XHR/Fetch shows API calls',
        'Click a request to see headers, payload, and response',
        'Right-click → Copy as cURL to replay requests',
        'Check "Preserve log" to keep logs across page loads'
      ],
      securityUse: 'Discover API endpoints, see authentication tokens, find hidden parameters, analyze request/response data'
    },
    { 
      id: 'application', 
      icon: Database, 
      name: 'Application',
      description: 'Explore client-side storage: Cookies, LocalStorage, SessionStorage, and more. See what data websites store in your browser.',
      tips: [
        'Cookies: View, edit, and delete cookies',
        'LocalStorage: Persistent key-value storage',
        'SessionStorage: Temporary storage cleared on tab close',
        'Click any item to view/edit its value'
      ],
      securityUse: 'Find session tokens, modify stored user data, discover sensitive information, test token manipulation'
    },
    { 
      id: 'sources', 
      icon: FileCode, 
      name: 'Sources',
      description: 'Browse all loaded JavaScript files. Set breakpoints, step through code, and understand how the application works.',
      tips: [
        'Click line numbers to set breakpoints',
        'Use Ctrl+P to search for files',
        'Pretty-print minified code with {} button',
        'Watch expressions to monitor variables'
      ],
      securityUse: 'Find hardcoded secrets, understand authentication logic, discover debug functions, bypass obfuscation'
    }
  ]
  
  return (
    <div className="interactive-demo devtools-explorer">
      <div className="demo-header">
        <h4>Click on each panel to learn what it does</h4>
      </div>
      
      <div className="devtools-mock">
        <div className="devtools-toolbar">
          {panels.map(panel => (
            <button
              key={panel.id}
              className={`devtools-tab ${activePanel === panel.id ? 'active' : ''}`}
              onClick={() => setActivePanel(activePanel === panel.id ? null : panel.id)}
            >
              <panel.icon size={14} />
              <span>{panel.name}</span>
            </button>
          ))}
        </div>
        
        <div className="devtools-content">
          {!activePanel ? (
            <div className="devtools-placeholder">
              <MousePointer size={24} />
              <p>Select a tab above to learn about it</p>
              <p className="hint">Press <kbd>F12</kbd> in your browser to open the real DevTools!</p>
            </div>
          ) : (
            panels.filter(p => p.id === activePanel).map(panel => (
              <div key={panel.id} className="panel-info">
                <div className="panel-header">
                  <panel.icon size={20} />
                  <h5>{panel.name} Panel</h5>
                </div>
                <p className="panel-description">{panel.description}</p>
                
                <div className="panel-tips">
                  <h6><Lightbulb size={14} /> Tips</h6>
                  <ul>
                    {panel.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="panel-security">
                  <h6><Lock size={14} /> Security Testing Uses</h6>
                  <p>{panel.securityUse}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Fundamentals Page Component
// ============================================
export default function FundamentalsPage() {
  const [activeSection, setActiveSection] = useState('bits')
  
  const sections = [
    { id: 'bits', icon: Binary, title: 'Bits & Binary' },
    { id: 'html', icon: Code, title: 'HTML' },
    { id: 'css', icon: Palette, title: 'CSS' },
    { id: 'js', icon: Zap, title: 'JavaScript' },
    { id: 'devtools', icon: Layout, title: 'DevTools' },
    { id: 'networking', icon: Globe, title: 'Networking' },
    { id: 'storage', icon: Database, title: 'Storage' },
    { id: 'servers', icon: Server, title: 'Servers' },
    { id: 'terminal', icon: Terminal, title: 'Terminal' }
  ]
  
  return (
    <div className="fundamentals-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to Home</Link>
          <h1>Web Fundamentals</h1>
          <p>
            New to web development and security? Start here! These interactive lessons 
            will teach you the basics you need before diving into the challenges.
          </p>
        </div>

        {/* Navigation */}
        <nav className="sections-nav">
          {sections.map(section => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <Icon size={18} />
                <span>{section.title}</span>
              </button>
            )
          })}
        </nav>

        {/* Content */}
        <div className="section-content">
          {/* Bits Section */}
          {activeSection === 'bits' && (
            <section className="content-section">
              <h2><Binary size={24} /> What is a Bit?</h2>
              <p>
                At the lowest level, computers only understand two things: <strong>0</strong> and <strong>1</strong>. 
                These are called <em>bits</em> (binary digits).
              </p>
              <p>
                Everything you see on a computer (text, images, videos, websites) is ultimately 
                represented as billions of 0s and 1s!
              </p>
              
              <div className="info-box">
                <h4>Quick Facts</h4>
                <ul>
                  <li><strong>1 bit</strong> = one 0 or 1</li>
                  <li><strong>8 bits</strong> = 1 byte (can represent 0 to 255)</li>
                  <li><strong>1 byte</strong> = one character of text (like 'A' = 65)</li>
                </ul>
              </div>
              
              <BitFlipper />
              
              <p className="section-note">
                <Lightbulb size={16} className="note-icon" />
                Understanding binary helps you grasp concepts like encoding (Base64), 
                encryption, and why "01000001" equals the letter "A"!
              </p>
            </section>
          )}

          {/* HTML Section */}
          {activeSection === 'html' && (
            <section className="content-section">
              <h2><Code size={24} /> HTML: The Structure</h2>
              <p>
                <strong>HTML</strong> (HyperText Markup Language) is the skeleton of every web page. 
                It defines what content appears: headings, paragraphs, buttons, images, links, and more.
              </p>
              
              <div className="info-box">
                <h4>Key Concepts</h4>
                <ul>
                  <li><strong>Tags</strong>: HTML uses tags like <code>&lt;h1&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;div&gt;</code></li>
                  <li><strong>Attributes</strong>: Extra info like <code>id="name"</code> or <code>class="btn"</code></li>
                  <li><strong>Nesting</strong>: Elements can contain other elements</li>
                  <li><strong>Structure</strong>: The order of elements determines the page layout</li>
                </ul>
              </div>
              
              <HtmlStructureDemo />
              
              <p className="section-note">
                <Lightbulb size={16} className="note-icon" />
                When hacking, you will often inspect HTML to find hidden fields, forms, 
                or comments left by developers!
              </p>
            </section>
          )}

          {/* CSS Section */}
          {activeSection === 'css' && (
            <section className="content-section">
              <h2><Palette size={24} /> CSS: The Style</h2>
              <p>
                <strong>CSS</strong> (Cascading Style Sheets) makes web pages look good. 
                It controls colors, fonts, spacing, layouts, and everything visual.
              </p>
              
              <div className="info-box">
                <h4>Key Concepts</h4>
                <ul>
                  <li><strong>Selectors</strong>: Target elements (<code>.class</code>, <code>#id</code>, <code>tag</code>)</li>
                  <li><strong>Properties</strong>: What to change (<code>color</code>, <code>font-size</code>)</li>
                  <li><strong>Values</strong>: How to change it (<code>red</code>, <code>16px</code>)</li>
                </ul>
              </div>
              
              <CssPlayground />
              
              <p className="section-note">
                <Lightbulb size={16} className="note-icon" />
                Security tip: Sometimes developers "hide" content using CSS (display: none). 
                But you can still see it in the source code!
              </p>
            </section>
          )}

          {/* JavaScript Section */}
          {activeSection === 'js' && (
            <section className="content-section">
              <h2><Zap size={24} /> JavaScript: The Behavior</h2>
              <p>
                <strong>JavaScript</strong> (JS) makes web pages interactive. It can respond to clicks, 
                fetch data, validate forms, animate elements, and much more.
              </p>
              
              <div className="code-example">
                <pre>{`// Change text when button is clicked
const button = document.querySelector('button');
button.addEventListener('click', () => {
  alert('You clicked the button!');
});

// Check if user is admin
if (user.role === 'admin') {
  showAdminPanel();
}`}</pre>
              </div>
              
              <WebTrioDemo />
              
              <div className="info-box warning">
                <h4>Security Insight</h4>
                <p>
                  JavaScript runs in your browser, which means you can see and modify it! 
                  Many security vulnerabilities come from trusting client side JavaScript 
                  without server side validation.
                </p>
              </div>
            </section>
          )}

          {/* DevTools Section */}
          {activeSection === 'devtools' && (
            <section className="content-section devtools-section">
              <h2><Layout size={24} /> Browser DevTools: Your Hacking Toolkit</h2>
              <p>
                <strong>DevTools</strong> (Developer Tools) is built into every modern browser. 
                It is the most important tool for web security testing. Press <kbd>F12</kbd> or 
                right-click and select "Inspect" to open it.
              </p>
              
              <div className="info-box">
                <h4>Why DevTools Matters for Security</h4>
                <p>
                  DevTools lets you see everything your browser sees and does. You can inspect HTML, 
                  run JavaScript, monitor network requests, and explore stored data. Many "client-side" 
                  security measures can be bypassed using DevTools because you have full control 
                  over your browser.
                </p>
              </div>

              <DevToolsDemo />

              <h3>Opening DevTools</h3>
              <div className="shortcut-list">
                <div className="shortcut">
                  <kbd>F12</kbd>
                  <span>Open/close DevTools</span>
                </div>
                <div className="shortcut">
                  <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd>
                  <span>Alternative shortcut</span>
                </div>
                <div className="shortcut">
                  <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd>
                  <span>Open directly to Console</span>
                </div>
                <div className="shortcut">
                  <span className="shortcut-text">Right-click → Inspect</span>
                  <span>Jump to specific element</span>
                </div>
              </div>

              <div className="info-box warning">
                <h4>Security Insight</h4>
                <p>
                  Every challenge in HackMe Lab can be solved using DevTools. Get comfortable 
                  with the Console and Application tabs, you will use them constantly!
                </p>
              </div>
            </section>
          )}

          {/* Networking Section: Focus on HOW data moves */}
          {activeSection === 'networking' && (
            <section className="content-section networking-section">
              <h2><Globe size={24} /> Networking: How Data Travels</h2>
              <p>
                This section explains <em>how your browser communicates</em> with other computers 
                on the internet. Think of it as understanding the roads and delivery trucks 
                that carry your data from point A to point B.
              </p>

              <div className="info-box">
                <h4>The Journey of a Web Request</h4>
                <p>When you type a URL and press Enter, your data travels through multiple steps:</p>
                <ol>
                  <li><strong>DNS Lookup</strong>: Your browser asks "What is the IP address for google.com?" and gets back something like <code>142.250.80.46</code></li>
                  <li><strong>TCP Connection</strong>: Your computer establishes a connection to that IP address on a specific <em>port</em> (usually port 80 or 443)</li>
                  <li><strong>HTTP Request</strong>: Your browser sends a formatted request message over this connection</li>
                  <li><strong>Response</strong>: Data travels back the same route to your browser</li>
                </ol>
              </div>

              <h3>IP Addresses and Ports</h3>
              <p>
                An <strong>IP address</strong> is like a street address for computers. Every device 
                connected to the internet has one. For example: <code>192.168.1.1</code> or <code>8.8.8.8</code>.
              </p>
              <p>
                A <strong>port</strong> is like an apartment number at that address. One computer 
                can run multiple services, each listening on a different port. Web servers 
                typically use port <code>80</code> (HTTP) or <code>443</code> (HTTPS).
              </p>

              <h3>HTTP: The Language of the Web</h3>
              <p>
                <strong>HTTP</strong> (HyperText Transfer Protocol) is the standardized format 
                for how browsers and servers talk. Every request includes a method, a path, 
                and headers. Every response includes a status code and the actual content.
              </p>
              <div className="method-cards">
                <div className="method-card get">
                  <h4>GET Request</h4>
                  <p>Asks the server to send back data. Used when loading pages, images, or fetching information.</p>
                  <code>GET /profile HTTP/1.1</code>
                </div>
                <div className="method-card post">
                  <h4>POST Request</h4>
                  <p>Sends data to the server. Used when submitting forms, logging in, or uploading files.</p>
                  <code>POST /login HTTP/1.1</code>
                </div>
              </div>

              <NetworkingDemo />

              <p className="section-note">
                <Lightbulb size={16} className="note-icon" />
                Security insight: Since data travels across many networks, attackers can potentially 
                intercept or modify requests in transit. This is why <strong>HTTPS</strong> encrypts 
                the connection, keeping your data private while it travels.
              </p>
            </section>
          )}

          {/* NEW: Storage Section */}
          {activeSection === 'storage' && (
            <section className="content-section">
              <h2><Database size={24} /> Cookies, LocalStorage, and Sessions</h2>
              <p>
                Web browsers can store data on your device. This data helps websites remember you, 
                save your preferences, and keep you logged in. But it also has security implications.
              </p>

              <div className="info-box">
                <h4>Types of Browser Storage</h4>
                <ul>
                  <li>
                    <strong>Cookies</strong>: Small pieces of data that are automatically sent to the 
                    server with every request. Often used for login sessions.
                  </li>
                  <li>
                    <strong>LocalStorage</strong>: Data stored in the browser that stays on your device. 
                    Not automatically sent to the server.
                  </li>
                  <li>
                    <strong>Sessions</strong>: A way for servers to remember who you are by giving you 
                    a unique session ID (usually stored in a cookie).
                  </li>
                </ul>
              </div>

              <h3>Why This Matters for Security</h3>
              <p>
                Since this data lives in your browser, you (or an attacker) can read and modify it. 
                A poorly designed app might trust client side storage without verifying it on the server.
              </p>

              <StoragePlayground />

              <div className="info-box warning">
                <h4>Security Warning</h4>
                <p>
                  Never trust data that comes from the client. Always validate permissions on the server. 
                  Just because a cookie says <code>role=admin</code> does not mean the user is actually an admin!
                </p>
              </div>

              <p className="section-note">
                <Lightbulb size={16} className="note-icon" />
                Several HackMe Lab challenges involve manipulating cookies and localStorage. 
                Now you understand why this can be a vulnerability!
              </p>
            </section>
          )}

          {/* Servers Section: Focus on WHAT the machine does */}
          {activeSection === 'servers' && (
            <section className="content-section servers-section">
              <h2><Server size={24} /> Servers: The Machines Behind Websites</h2>
              <p>
                While <em>networking</em> explains how data travels, this section explains 
                <strong> what happens on the other end</strong>: the server. A server is just 
                a computer that runs special software to handle incoming requests and send responses.
              </p>
              
              <div className="info-box">
                <h4>What Makes a Server a Server?</h4>
                <ul>
                  <li><strong>Always running</strong>: Servers stay on 24/7, waiting for requests</li>
                  <li><strong>Listens on ports</strong>: Server software binds to specific ports to receive traffic</li>
                  <li><strong>Runs backend code</strong>: Executes code in languages like Python, Node.js, PHP, or Java</li>
                  <li><strong>Connects to databases</strong>: Stores and retrieves data from databases like MySQL or MongoDB</li>
                </ul>
              </div>

              <h3>The Request-Response Cycle</h3>
              <p>
                When your request arrives at a server, the server software processes it through 
                several steps. Here is what happens behind the scenes:
              </p>
              
              <div className="server-cycle">
                <div className="cycle-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h5>Receive Request</h5>
                    <p>Server receives HTTP request with method, path, headers, and body</p>
                  </div>
                </div>
                <div className="cycle-arrow"><ArrowDown size={20} /></div>
                <div className="cycle-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h5>Route Matching</h5>
                    <p>Server finds the right handler for the URL path (e.g., /login → loginHandler)</p>
                  </div>
                </div>
                <div className="cycle-arrow"><ArrowDown size={20} /></div>
                <div className="cycle-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h5>Process Logic</h5>
                    <p>Run backend code: validate input, query database, apply business rules</p>
                  </div>
                </div>
                <div className="cycle-arrow"><ArrowDown size={20} /></div>
                <div className="cycle-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h5>Send Response</h5>
                    <p>Return HTTP response with status code (200 OK, 404 Not Found, etc.) and content</p>
                  </div>
                </div>
              </div>

              <h3>Server-Side vs Client-Side</h3>
              <div className="comparison-table">
                <div className="comparison-row header">
                  <div className="comparison-cell">Aspect</div>
                  <div className="comparison-cell">Client-Side (Browser)</div>
                  <div className="comparison-cell">Server-Side</div>
                </div>
                <div className="comparison-row">
                  <div className="comparison-cell">Code Visibility</div>
                  <div className="comparison-cell">Visible to users</div>
                  <div className="comparison-cell">Hidden from users</div>
                </div>
                <div className="comparison-row">
                  <div className="comparison-cell">Security</div>
                  <div className="comparison-cell">Can be bypassed</div>
                  <div className="comparison-cell">Trusted environment</div>
                </div>
                <div className="comparison-row">
                  <div className="comparison-cell">Database Access</div>
                  <div className="comparison-cell">Never direct</div>
                  <div className="comparison-cell">Full access</div>
                </div>
                <div className="comparison-row">
                  <div className="comparison-cell">Languages</div>
                  <div className="comparison-cell">JavaScript only</div>
                  <div className="comparison-cell">Python, Node, PHP, Java, etc.</div>
                </div>
              </div>

              <div className="info-box">
                <h4>Common Server Tasks</h4>
                <ul>
                  <li><strong>Authentication</strong>: Verifying usernames and passwords</li>
                  <li><strong>Database queries</strong>: Reading and writing data (users, posts, orders)</li>
                  <li><strong>File serving</strong>: Sending HTML, CSS, JS, and images to browsers</li>
                  <li><strong>API endpoints</strong>: Providing data in JSON format for apps</li>
                  <li><strong>Business logic</strong>: Calculating prices, validating orders, sending emails</li>
                </ul>
              </div>

              <div className="info-box warning">
                <h4>Security Insight</h4>
                <p>
                  Most vulnerabilities happen on the server. If the server trusts user input 
                  without validation, attackers can exploit it. Always validate and sanitize 
                  everything on the server side, even if you checked it in the browser!
                </p>
              </div>
            </section>
          )}

          {/* Terminal Section */}
          {activeSection === 'terminal' && (
            <section className="content-section">
              <h2><Terminal size={24} /> Terminal and Console</h2>
              <p>
                A <strong>terminal</strong> (or command line) lets you interact with a computer 
                by typing text commands instead of clicking buttons. It is a powerful tool 
                that developers and hackers use every day.
              </p>
              
              <p>
                Your browser also has a <strong>console</strong> (press F12, then go to Console tab) where 
                you can run JavaScript code and see messages from web pages.
              </p>
              
              <InteractiveTerminal />
              
              <div className="info-box">
                <h4>Common Terminal Commands</h4>
                <ul>
                  <li><code>ls</code> / <code>dir</code>: List files in the current directory</li>
                  <li><code>cd</code>: Change directory</li>
                  <li><code>cat</code> / <code>type</code>: Read and display file contents</li>
                  <li><code>pwd</code>: Print working directory (show current path)</li>
                  <li><code>echo</code>: Print text to the terminal</li>
                </ul>
              </div>
              
              <p className="section-note">
                <Lightbulb size={16} className="note-icon" />
                In the challenges, you will use your browser DevTools console to manipulate 
                JavaScript, inspect storage, and discover vulnerabilities!
              </p>
            </section>
          )}
        </div>

        {/* CTA */}
        <div className="fundamentals-cta">
          <h3>Ready to start hacking?</h3>
          <p>Now that you know the basics, try the security challenges!</p>
          <Link to="/challenges">
            <Button variant="primary" size="lg">
              <ChevronRight size={18} />
              Go to Challenges
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
