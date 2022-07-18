using System.Windows.Controls;

namespace Style_DataContext_Binding
{
    public partial class MainPage : UserControl
    {
        public MainPage()
        {
            InitializeComponent();
            for (int i = 0; i < 4; i++)
            {
                tcMainProcess.Items.Add(new MainProcessTabItem($"Tab{i}"));
            }
        }
    }
}