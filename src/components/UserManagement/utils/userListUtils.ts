
export const getAccessLevelLabel = (level?: string) => {
  switch(level) {
    case "limited": return "Limitado";
    case "basic": return "Básico";
    case "full": return "Completo";
    default: return "Básico";
  }
};

export const getAccessLevelColor = (level?: string) => {
  switch(level) {
    case "limited": return "border-yellow-500 text-yellow-500";
    case "full": return "bg-purple-600";
    case "basic": 
    default: return "bg-blue-500";
  }
};
