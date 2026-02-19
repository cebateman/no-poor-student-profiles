export type Locale = "en" | "pt";

const translations = {
  // ── Layout / Navigation ──
  "nav.loading": { en: "Loading...", pt: "Carregando..." },
  "nav.brand": { en: "NPA Admin", pt: "NPA Admin" },
  "nav.subtitle": { en: "Student Profile Management", pt: "Gestão de Perfis de Alunas" },
  "nav.dashboard": { en: "Dashboard", pt: "Painel" },
  "nav.addStudent": { en: "Add Student", pt: "Adicionar Aluna" },
  "nav.siteSettings": { en: "Site Settings", pt: "Configurações do Site" },
  "nav.manageAdmins": { en: "Manage Admins", pt: "Gerir Admins" },
  "nav.logout": { en: "Logout", pt: "Sair" },

  // ── Login ──
  "login.title": { en: "Admin Login", pt: "Login de Admin" },
  "login.subtitle": { en: "No Poor Africa - Student Profiles", pt: "No Poor Africa - Perfis de Alunas" },
  "login.username": { en: "Username", pt: "Utilizador" },
  "login.password": { en: "Password", pt: "Palavra-passe" },
  "login.signingIn": { en: "Signing in...", pt: "Entrando..." },
  "login.signIn": { en: "Sign In", pt: "Entrar" },
  "login.invalidCredentials": { en: "Invalid credentials", pt: "Credenciais inválidas" },
  "login.networkError": { en: "Network error. Please try again.", pt: "Erro de rede. Tente novamente." },

  // ── Dashboard ──
  "dashboard.title": { en: "Students", pt: "Alunas" },
  "dashboard.studentCount": { en: "student", pt: "aluna" },
  "dashboard.studentCountPlural": { en: "students", pt: "alunas" },
  "dashboard.found": { en: "found", pt: "encontrada(s)" },
  "dashboard.addNew": { en: "+ Add New Student", pt: "+ Adicionar Nova Aluna" },
  "dashboard.searchPlaceholder": { en: "Search by name...", pt: "Pesquisar por nome..." },
  "dashboard.allStatuses": { en: "All Statuses", pt: "Todos os Estados" },
  "dashboard.loadingStudents": { en: "Loading students...", pt: "Carregando alunas..." },
  "dashboard.noStudents": { en: "No students found.", pt: "Nenhuma aluna encontrada." },
  "dashboard.photo": { en: "Photo", pt: "Foto" },
  "dashboard.name": { en: "Name", pt: "Nome" },
  "dashboard.age": { en: "Age", pt: "Idade" },
  "dashboard.grade": { en: "Grade", pt: "Classe" },
  "dashboard.status": { en: "Status", pt: "Estado" },
  "dashboard.community": { en: "Community", pt: "Comunidade" },

  // ── Status labels ──
  "status.active": { en: "Active", pt: "Activa" },
  "status.graduated": { en: "Graduated", pt: "Graduada" },
  "status.alumni": { en: "Alumni", pt: "Ex-aluna" },
  "status.withdrawn": { en: "Withdrawn", pt: "Retirada" },

  // ── Common form labels ──
  "form.fullName": { en: "Full Name", pt: "Nome Completo" },
  "form.preferredName": { en: "Preferred Name", pt: "Nome Preferido" },
  "form.dateOfBirth": { en: "Date of Birth", pt: "Data de Nascimento" },
  "form.homeCommunity": { en: "Home Community", pt: "Comunidade de Origem" },
  "form.enrollmentYear": { en: "Enrollment Year", pt: "Ano de Inscrição" },
  "form.enrollmentGrade": { en: "Enrollment Grade", pt: "Classe de Inscrição" },
  "form.status": { en: "Status", pt: "Estado" },
  "form.graduationYear": { en: "Graduation Year", pt: "Ano de Graduação" },
  "form.graduationYearPlaceholder": { en: "Leave blank if not graduated", pt: "Deixe em branco se não graduou" },
  "form.isPublic": { en: "Visible on public website", pt: "Visível no site público" },
  "form.grade": { en: "Grade", pt: "Classe" },
  "form.save": { en: "Save Changes", pt: "Guardar Alterações" },
  "form.saving": { en: "Saving...", pt: "Guardando..." },
  "form.cancel": { en: "Cancel", pt: "Cancelar" },
  "form.required": { en: "Please fill in all required fields.", pt: "Por favor preencha todos os campos obrigatórios." },

  // ── New Student ──
  "newStudent.breadcrumb": { en: "New Student", pt: "Nova Aluna" },
  "newStudent.title": { en: "Add New Student", pt: "Adicionar Nova Aluna" },
  "newStudent.creating": { en: "Creating...", pt: "Criando..." },
  "newStudent.create": { en: "Create Student", pt: "Criar Aluna" },
  "newStudent.failedCreate": { en: "Failed to create student.", pt: "Falha ao criar aluna." },
  "newStudent.namePlaceholder": { en: "e.g. Maria Josefa Nhampossa", pt: "ex. Maria Josefa Nhampossa" },
  "newStudent.preferredNamePlaceholder": { en: "e.g. Maria", pt: "ex. Maria" },
  "newStudent.communityPlaceholder": { en: "e.g. Machava", pt: "ex. Machava" },

  // ── Student Detail ──
  "studentDetail.loadingStudent": { en: "Loading student...", pt: "Carregando aluna..." },
  "studentDetail.notFound": { en: "Student not found.", pt: "Aluna não encontrada." },
  "studentDetail.info": { en: "Student Information", pt: "Informação da Aluna" },
  "studentDetail.uploadPhoto": { en: "Upload profile photo", pt: "Carregar foto de perfil" },
  "studentDetail.ageLabel": { en: "Age", pt: "Idade" },
  "studentDetail.gradeLabel": { en: "Grade", pt: "Classe" },
  "studentDetail.yrsInProgram": { en: "yrs in program", pt: "anos no programa" },
  "studentDetail.savedSuccess": { en: "Student saved successfully.", pt: "Aluna guardada com sucesso." },
  "studentDetail.failedSave": { en: "Failed to save changes.", pt: "Falha ao guardar alterações." },
  "studentDetail.failedLoad": { en: "Failed to load student data.", pt: "Falha ao carregar dados da aluna." },
  "studentDetail.photoUpdated": { en: "Profile photo updated.", pt: "Foto de perfil actualizada." },
  "studentDetail.failedPhoto": { en: "Failed to upload photo.", pt: "Falha ao carregar foto." },
  "studentDetail.galleryAdded": { en: "Gallery photo added.", pt: "Foto da galeria adicionada." },
  "studentDetail.failedGallery": { en: "Failed to upload gallery photo.", pt: "Falha ao carregar foto da galeria." },

  // ── Snapshots ──
  "snapshot.title": { en: "Annual Snapshots", pt: "Registos Anuais" },
  "snapshot.addUpdate": { en: "+ Add This Year's Update", pt: "+ Adicionar Registo deste Ano" },
  "snapshot.noSnapshots": { en: "No snapshots yet. Add the first annual update for this student.", pt: "Sem registos ainda. Adicione o primeiro registo anual desta aluna." },
  "snapshot.gradeAtTime": { en: "Grade at Time", pt: "Classe na Altura" },
  "snapshot.dreamCareer": { en: "Dream Career", pt: "Carreira de Sonho" },
  "snapshot.favoriteSubject": { en: "Favorite Subject", pt: "Disciplina Favorita" },
  "snapshot.storyLanguage": { en: "Story Language", pt: "Língua da História" },
  "snapshot.storyOriginal": { en: "Story (Original)", pt: "História (Original)" },
  "snapshot.storyEnglish": { en: "Story (English)", pt: "História (Inglês)" },
  "snapshot.academicNotes": { en: "Academic Notes (Internal)", pt: "Notas Académicas (Interno)" },
  "snapshot.extraData": { en: "Extra Data", pt: "Dados Extra" },

  // ── Snapshot Form ──
  "snapshotForm.breadcrumbStudent": { en: "Student", pt: "Aluna" },
  "snapshotForm.breadcrumbNew": { en: "New Snapshot", pt: "Novo Registo" },
  "snapshotForm.title": { en: "Add Annual Snapshot", pt: "Adicionar Registo Anual" },
  "snapshotForm.yearRequired": { en: "Year and grade at time are required.", pt: "O ano e a classe são obrigatórios." },
  "snapshotForm.year": { en: "Year", pt: "Ano" },
  "snapshotForm.snapshotPhoto": { en: "Snapshot Photo", pt: "Foto do Registo" },
  "snapshotForm.choosePhoto": { en: "Choose a photo...", pt: "Escolher uma foto..." },
  "snapshotForm.studentStory": { en: "Student Story", pt: "História da Aluna" },
  "snapshotForm.storyLanguage": { en: "Story Language", pt: "Língua da História" },
  "snapshotForm.portuguese": { en: "Portuguese", pt: "Português" },
  "snapshotForm.english": { en: "English", pt: "Inglês" },
  "snapshotForm.localLanguage": { en: "Local Language", pt: "Língua Local" },
  "snapshotForm.storyTextLabel": { en: "Story Text (Original Language)", pt: "Texto da História (Língua Original)" },
  "snapshotForm.storyTextPlaceholder": { en: "Student's story in their original language...", pt: "História da aluna na língua original..." },
  "snapshotForm.translationLabel": { en: "Story English Translation", pt: "Tradução em Inglês" },
  "snapshotForm.translationPlaceholder": { en: "English translation of the story...", pt: "Tradução em inglês da história..." },
  "snapshotForm.interestsTitle": { en: "Interests & Academics", pt: "Interesses e Estudos" },
  "snapshotForm.dreamCareerPlaceholder": { en: "e.g. Doctor, Teacher, Engineer", pt: "ex. Médica, Professora, Engenheira" },
  "snapshotForm.favoriteSubjectPlaceholder": { en: "e.g. Mathematics, Science", pt: "ex. Matemática, Ciências" },
  "snapshotForm.academicNotesPlaceholder": { en: "Internal notes about academic performance, behavior, etc.", pt: "Notas internas sobre desempenho académico, comportamento, etc." },
  "snapshotForm.customFields": { en: "Custom Fields", pt: "Campos Personalizados" },
  "snapshotForm.addCustomField": { en: "+ Add Custom Field", pt: "+ Adicionar Campo" },
  "snapshotForm.noCustomFields": { en: "No custom fields added. Use this to store extra data as key/value pairs.", pt: "Sem campos personalizados. Use isto para guardar dados extra." },
  "snapshotForm.key": { en: "Key", pt: "Chave" },
  "snapshotForm.value": { en: "Value", pt: "Valor" },
  "snapshotForm.remove": { en: "Remove", pt: "Remover" },
  "snapshotForm.saveSnapshot": { en: "Save Snapshot", pt: "Guardar Registo" },
  "snapshotForm.failedCreate": { en: "Failed to create snapshot.", pt: "Falha ao criar registo." },

  // ── Gallery ──
  "gallery.title": { en: "Photo Gallery", pt: "Galeria de Fotos" },
  "gallery.addPhoto": { en: "+ Add Photo", pt: "+ Adicionar Foto" },
  "gallery.uploading": { en: "Uploading...", pt: "Carregando..." },
  "gallery.noPhotos": { en: "No gallery photos yet.", pt: "Sem fotos na galeria." },
  "gallery.featured": { en: "Featured", pt: "Destaque" },

  // ── Settings ──
  "settings.title": { en: "Site Settings", pt: "Configurações do Site" },
  "settings.subtitle": { en: "Configure the public-facing homepage", pt: "Configurar a página inicial pública" },
  "settings.heroTitle": { en: "Hero Background Image", pt: "Imagem de Fundo Principal" },
  "settings.heroDescription": { en: "This image appears behind the hero section on the homepage. Recommended size: 1920x1080px. If no image is set, the default green color scheme will be used.", pt: "Esta imagem aparece atrás da secção principal na página inicial. Tamanho recomendado: 1920x1080px. Se nenhuma imagem for definida, o esquema de cores verde padrão será usado." },
  "settings.heroPreview": { en: "Meet the girls.", pt: "Conheça as meninas." },
  "settings.unsaved": { en: "UNSAVED", pt: "NÃO GUARDADO" },
  "settings.defaultBg": { en: "Default green background (no image set)", pt: "Fundo verde padrão (sem imagem)" },
  "settings.changeImage": { en: "Change Image", pt: "Alterar Imagem" },
  "settings.uploadImage": { en: "Upload Image", pt: "Carregar Imagem" },
  "settings.save": { en: "Save", pt: "Guardar" },
  "settings.saving": { en: "Saving...", pt: "Guardando..." },
  "settings.removing": { en: "Removing...", pt: "Removendo..." },
  "settings.removeImage": { en: "Remove Image", pt: "Remover Imagem" },
  "settings.bgUpdated": { en: "Background image updated successfully!", pt: "Imagem de fundo actualizada com sucesso!" },
  "settings.bgRemoved": { en: "Background image removed. Default colors will be used.", pt: "Imagem de fundo removida. As cores padrão serão usadas." },
  "settings.failedLoad": { en: "Failed to load settings.", pt: "Falha ao carregar configurações." },
  "settings.failedSave": { en: "Failed to save settings.", pt: "Falha ao guardar configurações." },
  "settings.failedRemove": { en: "Failed to remove background image.", pt: "Falha ao remover imagem de fundo." },
  "settings.loadingSettings": { en: "Loading settings...", pt: "Carregando configurações..." },

  // ── Admin Management ──
  "admins.title": { en: "Manage Admins", pt: "Gerir Administradores" },
  "admins.subtitle": { en: "Create and manage admin accounts", pt: "Criar e gerir contas de admin" },
  "admins.addNew": { en: "+ Add New Admin", pt: "+ Adicionar Novo Admin" },
  "admins.name": { en: "Name", pt: "Nome" },
  "admins.username": { en: "Username", pt: "Utilizador" },
  "admins.password": { en: "Password", pt: "Palavra-passe" },
  "admins.created": { en: "Created", pt: "Criado" },
  "admins.actions": { en: "Actions", pt: "Acções" },
  "admins.delete": { en: "Delete", pt: "Eliminar" },
  "admins.deleting": { en: "Deleting...", pt: "Eliminando..." },
  "admins.noAdmins": { en: "No admin accounts found.", pt: "Nenhuma conta de admin encontrada." },
  "admins.loadingAdmins": { en: "Loading admins...", pt: "Carregando admins..." },
  "admins.createTitle": { en: "Create New Admin", pt: "Criar Novo Admin" },
  "admins.namePlaceholder": { en: "e.g. João Silva", pt: "ex. João Silva" },
  "admins.usernamePlaceholder": { en: "e.g. joao", pt: "ex. joao" },
  "admins.passwordPlaceholder": { en: "Minimum 6 characters", pt: "Mínimo 6 caracteres" },
  "admins.creating": { en: "Creating...", pt: "Criando..." },
  "admins.createAdmin": { en: "Create Admin", pt: "Criar Admin" },
  "admins.failedLoad": { en: "Failed to load admin accounts.", pt: "Falha ao carregar contas de admin." },
  "admins.failedCreate": { en: "Failed to create admin.", pt: "Falha ao criar admin." },
  "admins.failedDelete": { en: "Failed to delete admin.", pt: "Falha ao eliminar admin." },
  "admins.createdSuccess": { en: "Admin account created successfully!", pt: "Conta de admin criada com sucesso!" },
  "admins.deletedSuccess": { en: "Admin account deleted.", pt: "Conta de admin eliminada." },
  "admins.confirmDelete": { en: "Are you sure you want to delete this admin?", pt: "Tem certeza que deseja eliminar este admin?" },
  "admins.cannotDeleteSelf": { en: "You cannot delete your own account.", pt: "Não pode eliminar a sua própria conta." },

  // ── Common ──
  "common.networkError": { en: "Network error. Please try again.", pt: "Erro de rede. Tente novamente." },
  "common.unauthorized": { en: "Unauthorized", pt: "Não autorizado" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, locale: Locale): string {
  return translations[key][locale];
}

export function getStatusLabel(status: string, locale: Locale): string {
  const key = `status.${status}` as TranslationKey;
  if (key in translations) {
    return t(key, locale);
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
}
