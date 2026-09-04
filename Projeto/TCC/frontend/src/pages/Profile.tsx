import React, { useState } from "react";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { updateCurrentUser } from "../services/userService";
import { ImageIcon } from "../components/Icons";

interface Message {
  text: string;
  type: "success" | "error";
}

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<Message | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);

  if (!user) {
    return null;
  }

  const errorMessage = (err: unknown) =>
    err instanceof AxiosError ? err.response?.data?.message : undefined;

  const handleAvatarUrl = (value: string) => {
    setAvatar(value);
    setAvatarPreview(value.trim() || "");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      await updateProfile(user.id, { name, email, avatar: avatar.trim() });
      setProfileMessage({ text: "Perfil atualizado com sucesso!", type: "success" });
    } catch (err) {
      setProfileMessage({
        text: errorMessage(err) || "Erro ao atualizar o perfil.",
        type: "error",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ text: "A nova senha deve ter pelo menos 6 caracteres.", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: "A confirmação não confere com a nova senha.", type: "error" });
      return;
    }

    setSavingPassword(true);
    try {
      await updateCurrentUser(user.id, {
        password: newPassword,
        currentPassword,
      });
      setPasswordMessage({ text: "Senha alterada com sucesso!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMessage({
        text: errorMessage(err) || "Erro ao alterar a senha.",
        type: "error",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-ink">Meu perfil</h1>
      <p className="mt-1 text-sm text-muted">
        Atualize suas informações pessoais e sua senha.
      </p>

      <div className="mt-6 space-y-6">
        {/* Dados pessoais */}
        <form
          onSubmit={handleSaveProfile}
          className="rounded-2xl border border-line bg-white p-6 shadow-lift"
        >
          <h2 className="text-base font-bold text-ink">Dados pessoais</h2>

          <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Foto de perfil"
                  onError={() => setAvatarPreview("")}
                  className="h-24 w-24 rounded-full border border-line object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
            </div>

            <div className="w-full flex-1 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted">Foto (URL)</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => handleAvatarUrl(e.target.value)}
                  placeholder="https://.../foto.jpg"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {profileMessage && (
            <div
              className={`mt-4 rounded-xl border p-3 text-sm font-medium ${
                profileMessage.type === "success"
                  ? "border-green-200 bg-success-soft text-green-700"
                  : "border-red-200 bg-danger-soft text-red-700"
              }`}
              role="status"
            >
              {profileMessage.text}
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingProfile ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>

        {/* Alterar senha */}
        <form
          onSubmit={handleChangePassword}
          className="rounded-2xl border border-line bg-white p-6 shadow-lift"
        >
          <h2 className="text-base font-bold text-ink">Alterar senha</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">
                Senha atual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">Nova senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">
                Confirmar nova senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                autoComplete="new-password"
              />
            </div>
          </div>

          {passwordMessage && (
            <div
              className={`mt-4 rounded-xl border p-3 text-sm font-medium ${
                passwordMessage.type === "success"
                  ? "border-green-200 bg-success-soft text-green-700"
                  : "border-red-200 bg-danger-soft text-red-700"
              }`}
              role="status"
            >
              {passwordMessage.text}
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingPassword ? "Alterando..." : "Alterar senha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;