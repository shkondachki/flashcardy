import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './MarkdownRenderer.module.scss';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
      <div className={`${styles.markdown} ${className || ''}`}>
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const { node, inline, className, children, ...rest } = props as any;
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';

                return !inline && language ? (
                    <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={language}
                        customStyle={{
                          margin: 0,
                          borderRadius: '8px',
                          fontSize: '15px',
                          padding: '16px',
                          background: "#272727"
                        }}
                        codeTagProps={{
                          style: {
                            fontSize: '15px',
                            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                          }
                        }}
                        PreTag="div"
                        {...rest}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                ) : (
                    <code className={className} {...rest}>
                      {children}
                    </code>
                );
              },
            }}
        >
          {content}
        </ReactMarkdown>
      </div>
  );
}