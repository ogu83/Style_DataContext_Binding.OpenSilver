using System.Windows.Controls;
using System.Windows.Media;

namespace Style_DataContext_Binding
{
    public partial class MainPage : UserControl
    {
        public MainPage()
        {
            InitializeComponent();
            CustomLayout = true;
            for (int i = 0; i < 4; i++)
            {
                switch (i)
                {
                    case 0:
                    default:
                        tcMainProcess.Items.Add(new MainProcessTabItem($"Acktualisera"));
                        break;
                    case 1:
                        tcMainProcess.Items.Add(new MainProcessTabItem($"AnSökan"));
                        break;
                    case 2:
                        tcMainProcess.Items.Add(new MainProcessTabItem($"Atgræd"));
                        break;
                    case 3:
                        tcMainProcess.Items.Add(new MainProcessTabItem($"SudokuDokuments"));
                        break;
                }
            }
        }
    }
}