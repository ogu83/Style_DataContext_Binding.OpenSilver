using System.Windows;
using System.Windows.Controls;

namespace Style_DataContext_Binding
{
    public partial class MainProcessTabItem : TabItem
    {
        public MyBaseViewModel Vm { get; set; } = new MyViewModel();

        public MainProcessTabItem()
        {
            InitializeComponent();
        }

        public MainProcessTabItem(string title) : base()
        {
            DataContext = Vm;
            (Vm as MyViewModel).Title = title;
            Style = Application.Current.Resources["MainProcessStepStyle"] as Style;
            Header = HeaderTemplate.LoadContent();
        }
    }
}