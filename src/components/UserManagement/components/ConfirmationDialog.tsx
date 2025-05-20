
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  actionType: 'delete' | 'approve' | null;
}

const ConfirmationDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  actionType 
}: ConfirmationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {actionType === 'delete' 
              ? "Excluir usuário" 
              : "Aprovar usuário"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {actionType === 'delete'
              ? "Esta ação não pode ser desfeita. Este usuário será permanentemente removido do sistema."
              : "Esta ação permitirá que o usuário acesse o sistema com as permissões designadas."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className={actionType === 'delete' ? 'bg-red-600' : 'bg-green-600'}
          >
            {actionType === 'delete' ? "Sim, excluir" : "Sim, aprovar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
