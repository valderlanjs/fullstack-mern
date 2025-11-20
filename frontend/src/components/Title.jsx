const Title = ({ title, titleStyles, customStyle }) => {
  return (
    <h2 
      className={`text-4xl font-bold md:text-5xl mb-12 ${titleStyles}`}
      style={customStyle}
    >
      {title}
    </h2>
  );
};

export default Title;