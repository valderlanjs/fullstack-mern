import ReactMarkdown from 'react-markdown';

const SafeMarkdown = ({ children, ...props }) => {
  // ✅ Garante que children seja sempre uma string
  const safeChildren = typeof children === 'string' ? children : '';
  
  return (
    <ReactMarkdown {...props}>
      {safeChildren}
    </ReactMarkdown>
  );
};

export default SafeMarkdown;