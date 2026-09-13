using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Win32;

namespace AppNest.Client;

internal static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();
        Application.Run(new MainForm());
    }
}

public sealed class MainForm : Form
{
    private readonly TextBox manifestUrl = new() { Dock = DockStyle.Top, PlaceholderText = "AppNest manifest URL" };
    private readonly TextBox token = new() { Dock = DockStyle.Top, PlaceholderText = "Installer token", UseSystemPasswordChar = true };
    private readonly Button syncButton = new() { Text = "Load verified installer", Dock = DockStyle.Top, Height = 42 };
    private readonly Button inventoryButton = new() { Text = "Scan installed applications", Dock = DockStyle.Top, Height = 42 };
    private readonly ListBox output = new() { Dock = DockStyle.Fill };
    private static readonly HttpClient Http = new();

    public MainForm()
    {
        Text = "AppNest Windows Client";
        Width = 760;
        Height = 520;
        Padding = new Padding(18);
        Controls.Add(output);
        Controls.Add(inventoryButton);
        Controls.Add(syncButton);
        Controls.Add(token);
        Controls.Add(manifestUrl);
        syncButton.Click += async (_, _) => await LoadManifestAsync();
        inventoryButton.Click += (_, _) => ScanInstalledApplications();
        manifestUrl.Text = "http://localhost:3000/api/installer/";
        output.Items.Add("AppNest client ready. Generate a verified installer configuration from the web builder first.");
    }

    private async Task LoadManifestAsync()
    {
        try
        {
            syncButton.Enabled = false;
            var url = manifestUrl.Text.Trim().TrimEnd('/') + "?token=" + Uri.EscapeDataString(token.Text.Trim());
            var json = await Http.GetStringAsync(url);
            using var document = JsonDocument.Parse(json);
            var config = document.RootElement.GetProperty("config");
            output.Items.Clear();
            output.Items.Add("Verified manifest loaded.");
            foreach (var item in config.GetProperty("items").EnumerateArray())
            {
                var name = item.GetProperty("name").GetString() ?? "Unknown";
                var version = item.GetProperty("version").GetString() ?? "Unknown";
                var verified = item.GetProperty("verified").GetBoolean();
                output.Items.Add($"{(verified ? "✓" : "!")} {name} {version}");
            }
        }
        catch (Exception ex)
        {
            output.Items.Clear();
            output.Items.Add("Manifest could not be loaded: " + ex.Message);
        }
        finally { syncButton.Enabled = true; }
    }

    private void ScanInstalledApplications()
    {
        output.Items.Clear();
        var roots = new[]
        {
            (RegistryHive.LocalMachine, @"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"),
            (RegistryHive.LocalMachine, @"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"),
            (RegistryHive.CurrentUser, @"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall")
        };
        var found = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var (hive, path) in roots)
        {
            using var baseKey = RegistryKey.OpenBaseKey(hive, RegistryView.Registry64);
            using var key = baseKey.OpenSubKey(path);
            if (key == null) continue;
            foreach (var name in key.GetSubKeyNames())
            {
                using var app = key.OpenSubKey(name);
                var displayName = app?.GetValue("DisplayName") as string;
                var version = app?.GetValue("DisplayVersion") as string;
                if (string.IsNullOrWhiteSpace(displayName) || !found.Add(displayName)) continue;
                output.Items.Add($"{displayName} {version}");
            }
        }
        if (output.Items.Count == 0) output.Items.Add("No installed applications were found in the Windows uninstall registry.");
    }
}
