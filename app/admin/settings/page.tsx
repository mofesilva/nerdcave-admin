"use client";

import { useState, useEffect } from "react";
import { Bell, Shield, Database, Save, Check, Monitor, Loader2 } from "lucide-react";
import Button from "@/_components/Button";
import { cn } from "@/lib/utils";
import { useSystemSettings } from "@/lib/contexts/SystemSettingsContext";

export default function SettingsPage() {
    const { fullWidthLayout, updateFullWidthLayout, loading: systemLoading, refreshSettings } = useSystemSettings();
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [formData, setFormData] = useState({
        // Notificacoes
        emailNotifications: true,
        pushNotifications: false,
        weeklyDigest: true,
        // Seguranca
        twoFactorAuth: false,
        sessionTimeout: "30",
        // Sistema
        maintenanceMode: false,
        debugMode: false,
        cacheEnabled: true,
        // Layout
        fullWidthLayout: false,
    });

    // Sync fullWidthLayout from context
    useEffect(() => {
        setFormData(prev => ({ ...prev, fullWidthLayout }));
    }, [fullWidthLayout]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Save layout setting to MongoDB
            await updateFullWidthLayout(formData.fullWidthLayout);
            // Refresh to ensure we have latest data
            await refreshSettings();
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = (field: keyof typeof formData) => {
        setFormData(prev => ({ ...prev, [field]: !prev[field] as any }));
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-3">

                {/* Notificacoes */}
                <div className="bg-card rounded-md p-8 shadow-sm border border-border/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">Notificacoes</h2>
                    </div>

                    <div className="space-y-4">
                        <ToggleRow
                            label="Notificacoes por E-mail"
                            description="Receba atualizacoes importantes por e-mail"
                            checked={formData.emailNotifications}
                            onChange={() => handleToggle("emailNotifications")}
                        />
                        <ToggleRow
                            label="Notificacoes Push"
                            description="Receba notificacoes em tempo real no navegador"
                            checked={formData.pushNotifications}
                            onChange={() => handleToggle("pushNotifications")}
                        />
                        <ToggleRow
                            label="Resumo Semanal"
                            description="Receba um resumo semanal das atividades"
                            checked={formData.weeklyDigest}
                            onChange={() => handleToggle("weeklyDigest")}
                        />
                    </div>
                </div>

                {/* Seguranca */}
                <div className="bg-card rounded-md p-8 shadow-sm border border-border/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">Seguranca</h2>
                    </div>

                    <div className="space-y-4">
                        <ToggleRow
                            label="Autenticacao em Dois Fatores"
                            description="Adicione uma camada extra de seguranca a sua conta"
                            checked={formData.twoFactorAuth}
                            onChange={() => handleToggle("twoFactorAuth")}
                        />

                        <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                            <div>
                                <p className="font-medium text-foreground">Timeout da Sessao</p>
                                <p className="text-sm text-muted-foreground">
                                    Tempo de inatividade antes do logout automatico
                                </p>
                            </div>
                            <select
                                value={formData.sessionTimeout}
                                onChange={(e) => setFormData(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                                className="px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                            >
                                <option value="15">15 minutos</option>
                                <option value="30">30 minutos</option>
                                <option value="60">1 hora</option>
                                <option value="120">2 horas</option>
                                <option value="0">Nunca</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Sistema */}
                <div className="bg-card rounded-md p-8 shadow-sm border border-border/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Database className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">Sistema</h2>
                    </div>

                    <div className="space-y-4">
                        <ToggleRow
                            label="Modo de Manutencao"
                            description="Desativa o acesso publico ao site durante manutencoes"
                            checked={formData.maintenanceMode}
                            onChange={() => handleToggle("maintenanceMode")}
                        />
                        <ToggleRow
                            label="Modo Debug"
                            description="Exibe informacoes detalhadas de erros (apenas desenvolvimento)"
                            checked={formData.debugMode}
                            onChange={() => handleToggle("debugMode")}
                        />
                        <ToggleRow
                            label="Cache Habilitado"
                            description="Melhora a performance armazenando dados em cache"
                            checked={formData.cacheEnabled}
                            onChange={() => handleToggle("cacheEnabled")}
                        />
                    </div>
                </div>

                {/* Interface */}
                <div className="bg-card rounded-md p-8 shadow-sm border border-border/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Monitor className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">Interface</h2>
                    </div>

                    <div className="space-y-4">
                        <ToggleRow
                            label="Layout em Tela Cheia"
                            description="Em telas maiores que 1080px, o conteudo ocupara toda a largura disponivel"
                            checked={formData.fullWidthLayout}
                            onChange={() => handleToggle("fullWidthLayout")}
                        />
                    </div>
                </div>

                {/* Botao Salvar */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        icon={isSaving ? Loader2 : (isSaved ? Check : Save)}
                        disabled={isSaving || isSaved}
                    >
                        {isSaving ? "Salvando..." : (isSaved ? "Salvo!" : "Salvar Configuracoes")}
                    </Button>
                </div>
            </form>
        </div>
    );
}

// --- TOGGLE ROW COMPONENT -----------------------------------------------

function ToggleRow({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
            <div>
                <p className="font-medium text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={onChange}
                className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    checked ? "bg-primary" : "bg-muted"
                )}
            >
                <span
                    className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                        checked ? "translate-x-5" : "translate-x-0"
                    )}
                />
            </button>
        </div>
    );
}
