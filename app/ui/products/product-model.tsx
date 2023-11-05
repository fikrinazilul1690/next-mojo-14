import '@google/model-viewer';

type Props = {
  src: string;
  alt: string;
  className?: string;
};

const Model = ({ src, alt, className = '' }: Props) => (
  <model-viewer
    src={src}
    alt={alt}
    shadow-intensity='1'
    disable-zoom
    camera-controls
    auto-rotate
    // @ts-ignore
    class={className}
  ></model-viewer>
);

export default Model;
