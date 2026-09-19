/* eslint-disable react/prop-types */
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Select,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ADD, DELETE, GET, UPDATE } from "../../Controllers/ApiControllers";
import admin from "../../Controllers/admin";
import ShowToast from "../../Controllers/ShowToast";
import DynamicTable from "../../Components/DataTable";
import imageBaseURL from "../../Controllers/image";

const getWebsiteHome = async () => {
  const res = await GET(admin.token, "get_website_home_admin");
  if (res.response !== 200) throw new Error(res.message);
  return res.data;
};

const getCategories = async () => {
  const res = await GET(admin.token, "get_blog_categories");
  if (res.response !== 200) throw new Error(res.message);
  return res.data;
};

const getBlogs = async () => {
  const res = await GET(admin.token, "get_blogs");
  if (res.response !== 200) throw new Error(res.message);
  return res.data;
};

const getServices = async () => {
  const res = await GET(admin.token, "get_website_services_admin");
  if (res.response !== 200) throw new Error(res.message);
  return res.data;
};

const getMessages = async () => {
  const res = await GET(admin.token, "get_website_contact_messages");
  if (res.response !== 200) throw new Error(res.message);
  return res.data;
};

const getFaqs = async () => {
  const res = await GET(admin.token, "get_website_faqs_admin");
  if (res.response !== 200) throw new Error(res.message);
  return res.data;
};

const getAbout = async () => {
  const res = await GET(admin.token, "get_website_about_admin");
  if (res.response !== 200) throw new Error(res.message);
  return res.data;
};

export default function WebsiteManagement() {
  return (
    <Box dir="rtl">
      <Heading size="md" mb={5}>
        إدارة محتوى الموقع
      </Heading>
      <Tabs colorScheme="blue" isLazy>
        <TabList overflowX="auto">
          <Tab>الرئيسية</Tab>
          <Tab>من نحن</Tab>
          <Tab>الخدمات</Tab>
          <Tab>المقالات</Tab>
          <Tab>التصنيفات</Tab>
          <Tab>الأسئلة الشائعة</Tab>
          <Tab>رسائل التواصل</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <HomeContent />
          </TabPanel>
          <TabPanel px={0}>
            <AboutUs />
          </TabPanel>
          <TabPanel px={0}>
            <Services />
          </TabPanel>
          <TabPanel px={0}>
            <Blogs />
          </TabPanel>
          <TabPanel px={0}>
            <Categories />
          </TabPanel>
          <TabPanel px={0}>
            <Faqs />
          </TabPanel>
          <TabPanel px={0}>
            <ContactMessages />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

function HomeContent() {
  const { register, handleSubmit, reset } = useForm();
  const [heroBanner, setHeroBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading: isFetching } = useQuery({
    queryKey: ["website-home"],
    queryFn: getWebsiteHome,
  });

  useEffect(() => {
    if (data?.content) reset(data.content);
  }, [data, reset]);

  const handleUpdate = async (values) => {
    const formData = { ...values };
    if (heroBanner) formData.hero_banner = heroBanner;

    try {
      setIsLoading(true);
      const res = await UPDATE(admin.token, "update_website_home", formData);
      setIsLoading(false);
      if (res.response === 200) {
        ShowToast(toast, "success", "تم تحديث محتوى الرئيسية");
        setHeroBanner(null);
        queryClient.invalidateQueries(["website-home"]);
      } else {
        ShowToast(toast, "error", res.message);
      }
    } catch (error) {
      setIsLoading(false);
      ShowToast(toast, "error", JSON.stringify(error));
    }
  };

  const removeBanner = async () => {
    const res = await DELETE(admin.token, "remove_website_home_banner", {});
    if (res.response === 200) {
      ShowToast(toast, "success", "تم حذف صورة الهيرو");
      queryClient.invalidateQueries(["website-home"]);
    }
  };

  if (isFetching) return <Skeleton h={400} />;

  return (
    <Box as="form" onSubmit={handleSubmit(handleUpdate)}>
      <SectionTitle title="قسم الهيرو" />
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
        <TranslatedInput label="عنوان الهيرو" enName="hero_title" arName="hero_title_ar" register={register} />
        <TranslatedInput label="نص الزر" enName="hero_button_text" arName="hero_button_text_ar" register={register} />
        <InputField label="رابط الزر" name="hero_button_href" register={register} dir="ltr" />
        <FormControl>
          <FormLabel>صورة الهيرو</FormLabel>
          <Input type="file" accept=".jpeg,.jpg,.png,.webp,.svg" onChange={(e) => setHeroBanner(e.target.files[0])} />
        </FormControl>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <TranslatedTextarea label="الوصف" enName="hero_description" arName="hero_description_ar" register={register} />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <TranslatedTextarea label="الوصف الإضافي" enName="hero_sub_description" arName="hero_sub_description_ar" register={register} />
        </GridItem>
      </Grid>
      {data?.content?.hero_banner && (
        <Flex mt={4} gap={4} align="center">
          <Image src={`${imageBaseURL}/${data.content.hero_banner}`} boxSize="90px" objectFit="cover" borderRadius={6} />
          <Button size="sm" colorScheme="red" onClick={removeBanner}>
            حذف الصورة
          </Button>
        </Flex>
      )}

      <SectionTitle title="القسم الثاني" />
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
        <TranslatedInput label="عنوان القسم" enName="features_title" arName="features_title_ar" register={register} />
        <TranslatedTextarea label="وصف القسم" enName="features_description" arName="features_description_ar" register={register} />
      </Grid>
      <HomeFeatures maxItems={6} />

      <SectionTitle title="القسم الثالث" />
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
        <TranslatedInput label="عنوان القسم" enName="cta_title" arName="cta_title_ar" register={register} />
        <TranslatedInput label="نص الزر" enName="cta_button_text" arName="cta_button_text_ar" register={register} />
        <InputField label="رابط الزر" name="cta_button_href" register={register} dir="ltr" />
        <TranslatedTextarea label="وصف القسم" enName="cta_description" arName="cta_description_ar" register={register} />
        <InputField label="أيقونة العنوان الفرعي الأول" name="cta_first_icon" register={register} dir="ltr" />
        <TranslatedInput label="العنوان الفرعي الأول" enName="cta_first_title" arName="cta_first_title_ar" register={register} />
        <InputField label="أيقونة العنوان الفرعي الثاني" name="cta_second_icon" register={register} dir="ltr" />
        <TranslatedInput label="العنوان الفرعي الثاني" enName="cta_second_title" arName="cta_second_title_ar" register={register} />
      </Grid>

      <Flex justify="end" mt={6}>
        <Button type="submit" colorScheme="blue" isLoading={isLoading}>
          حفظ
        </Button>
      </Flex>
    </Box>
  );
}

function HomeFeatures({ maxItems }) {
  const empty = { icon: "", title: "", title_ar: "", description: "", description_ar: "", sort_order: 0, is_active: true };
  const [form, setForm] = useState(empty);
  const [selectedId, setSelectedId] = useState(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ["website-home"], queryFn: getWebsiteHome });
  const featuresCount = data?.features?.length || 0;
  const maxReached = maxItems && featuresCount >= maxItems && !selectedId;

  const saveFeature = async () => {
    if (maxReached) {
      ShowToast(toast, "error", `يمكنك إضافة ${maxItems} عناصر فقط`);
      return;
    }

    const endpoint = selectedId ? "update_website_home_feature" : "add_website_home_feature";
    const action = selectedId ? UPDATE : ADD;
    const payload = {
      ...form,
      id: selectedId,
      sort_order: selectedId ? form.sort_order : featuresCount + 1,
      is_active: true,
    };
    const res = await action(admin.token, endpoint, payload);
    if (res.response === 200) {
      ShowToast(toast, "success", "تم حفظ العنصر");
      setForm(empty);
      setSelectedId(null);
      queryClient.invalidateQueries(["website-home"]);
    } else {
      ShowToast(toast, "error", res.message);
    }
  };

  const deleteFeature = async (id) => {
    const res = await DELETE(admin.token, "delete_website_home_feature", { id });
    if (res.response === 200) {
      ShowToast(toast, "success", "تم حذف العنصر");
      queryClient.invalidateQueries(["website-home"]);
    }
  };

  if (isLoading) return <Skeleton h={300} />;

  return (
    <Box mt={5}>
      <Flex justify="space-between" align="center" mb={3} gap={3}>
        <Heading size="xs">عناصر القسم الثاني</Heading>
        <Badge colorScheme={maxReached ? "red" : "blue"}>
          {featuresCount}/{maxItems || "unlimited"}
        </Badge>
      </Flex>
      <Grid templateColumns={{ base: "1fr", lg: "160px repeat(2, 1fr)" }} gap={3} alignItems="end">
        <PlainInput label="الأيقونة" value={form.icon} onChange={(value) => setForm({ ...form, icon: value })} dir="ltr" />
        <PlainInput label="العنوان بالإنجليزي" value={form.title} onChange={(value) => setForm({ ...form, title: value })} dir="ltr" />
        <PlainInput label="العنوان بالعربي" value={form.title_ar} onChange={(value) => setForm({ ...form, title_ar: value })} />
        <GridItem colSpan={{ base: 1, lg: 1 }} />
        <PlainTextarea label="الوصف بالإنجليزي" value={form.description} onChange={(value) => setForm({ ...form, description: value })} rows={2} dir="ltr" />
        <PlainTextarea label="الوصف بالعربي" value={form.description_ar} onChange={(value) => setForm({ ...form, description_ar: value })} rows={2} />
      </Grid>
      <Flex gap={2} justify="end" mt={4}>
        <Button size="sm" onClick={() => { setForm(empty); setSelectedId(null); }}>
          تفريغ
        </Button>
        <Button size="sm" colorScheme="blue" onClick={saveFeature} isDisabled={(!form.title && !form.title_ar) || maxReached}>
          {selectedId ? "تحديث" : "إضافة"} عنصر
        </Button>
      </Flex>
      <Divider my={5} />
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap={4}>
        {data?.features?.map((item) => (
          <Box key={item.id} borderWidth="1px" borderRadius={6} p={4}>
            <Flex justify="space-between" gap={3}>
              <Text fontWeight="bold">{item.title}</Text>
              <Badge colorScheme={item.is_active ? "green" : "gray"}>{item.is_active ? "ظاهر" : "مخفي"}</Badge>
            </Flex>
            <Text fontSize="sm" color="gray.600" mt={1}>{item.icon}</Text>
            <Text mt={2}>{item.description}</Text>
            <Flex justify="end" gap={2} mt={4}>
              <Button size="xs" onClick={() => { setSelectedId(item.id); setForm(item); }}>تعديل</Button>
              <Button size="xs" colorScheme="red" onClick={() => deleteFeature(item.id)}>حذف</Button>
            </Flex>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}

function AboutUs() {
  const { register, handleSubmit, reset } = useForm();
  const [sectionOneImages, setSectionOneImages] = useState([]);
  const [sectionTwoImages, setSectionTwoImages] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ["website-about"], queryFn: getAbout });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const handleUpdate = async (values) => {
    const formData = { ...values };
    if (sectionOneImages.length) formData.section_one_images = sectionOneImages;
    Object.entries(sectionTwoImages).forEach(([key, file]) => {
      if (file) formData[key] = file;
    });

    try {
      setIsSaving(true);
      const res = await UPDATE(admin.token, "update_website_about", formData);
      setIsSaving(false);
      if (res.response === 200) {
        ShowToast(toast, "success", "تم تحديث محتوى من نحن");
        setSectionOneImages([]);
        setSectionTwoImages({});
        queryClient.invalidateQueries(["website-about"]);
      } else {
        ShowToast(toast, "error", res.message);
      }
    } catch (error) {
      setIsSaving(false);
      ShowToast(toast, "error", JSON.stringify(error));
    }
  };

  if (isLoading) return <Skeleton h={400} />;

  return (
    <Box as="form" onSubmit={handleSubmit(handleUpdate)}>
      <SectionTitle title="الوصف الرئيسي" />
      <TranslatedTextarea label="الوصف" enName="description" arName="description_ar" register={register} />

      <SectionTitle title="القسم الأول" />
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
        <TranslatedInput label="العنوان" enName="section_one_title" arName="section_one_title_ar" register={register} />
        <FormControl>
          <FormLabel>الصور</FormLabel>
          <Input
            type="file"
            multiple
            accept=".jpeg,.jpg,.png,.webp,.svg"
            onChange={(e) => setSectionOneImages(Array.from(e.target.files))}
          />
        </FormControl>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <TranslatedTextarea label="الوصف" enName="section_one_description" arName="section_one_description_ar" register={register} />
        </GridItem>
      </Grid>
      {!!data?.section_one_images?.length && (
        <Flex mt={4} gap={3} wrap="wrap">
          {data.section_one_images.map((image) => (
            <Image key={image} src={`${imageBaseURL}/${image}`} boxSize="90px" objectFit="cover" borderRadius={6} />
          ))}
        </Flex>
      )}

      <SectionTitle title="القسم الثاني" />
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
        <TranslatedInput label="العنوان" enName="section_two_title" arName="section_two_title_ar" register={register} />
        <ImageInput label="الصورة الأولى" name="section_two_image_one" onChange={setSectionTwoImages} />
        <TranslatedTextarea label="الوصف الأول" enName="section_two_description_one" arName="section_two_description_one_ar" register={register} />
        <ImageInput label="الصورة الثانية" name="section_two_image_two" onChange={setSectionTwoImages} />
        <TranslatedTextarea label="الوصف الثاني" enName="section_two_description_two" arName="section_two_description_two_ar" register={register} />
        <ImageInput label="الصورة الثالثة" name="section_two_image_three" onChange={setSectionTwoImages} />
        <TranslatedTextarea label="الوصف الثالث" enName="section_two_description_three" arName="section_two_description_three_ar" register={register} />
      </Grid>
      <Flex mt={4} gap={3} wrap="wrap">
        {["section_two_image_one", "section_two_image_two", "section_two_image_three"].map((field) => (
          data?.[field] ? <Image key={field} src={`${imageBaseURL}/${data[field]}`} boxSize="90px" objectFit="cover" borderRadius={6} /> : null
        ))}
      </Flex>

      <Flex justify="end" mt={6}>
        <Button type="submit" colorScheme="blue" isLoading={isSaving}>
          حفظ
        </Button>
      </Flex>
    </Box>
  );
}

function Categories() {
  const [form, setForm] = useState({ name: "", name_ar: "", slug: "", is_active: true });
  const [selectedId, setSelectedId] = useState(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ["blog-categories"], queryFn: getCategories });

  const saveCategory = async () => {
    const endpoint = selectedId ? "update_blog_category" : "add_blog_category";
    const action = selectedId ? UPDATE : ADD;
    const res = await action(admin.token, endpoint, { ...form, id: selectedId });
    if (res.response === 200) {
      ShowToast(toast, "success", "تم حفظ التصنيف");
      setForm({ name: "", name_ar: "", slug: "", is_active: true });
      setSelectedId(null);
      queryClient.invalidateQueries(["blog-categories"]);
    } else {
      ShowToast(toast, "error", res.message);
    }
  };

  const deleteCategory = async (id) => {
    const res = await DELETE(admin.token, "delete_blog_category", { id });
    if (res.response === 200) {
      ShowToast(toast, "success", "تم حذف التصنيف");
      queryClient.invalidateQueries(["blog-categories"]);
    }
  };

  if (isLoading) return <Skeleton h={300} />;

  return (
    <Box>
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 120px" }} gap={3} alignItems="end">
        <PlainInput label="الاسم بالإنجليزي" value={form.name} onChange={(value) => setForm({ ...form, name: value })} dir="ltr" />
        <PlainInput label="الاسم بالعربي" value={form.name_ar} onChange={(value) => setForm({ ...form, name_ar: value })} />
        <PlainInput label="الرابط المختصر" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} dir="ltr" />
        <Checkbox isChecked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}>
          ظاهر
        </Checkbox>
      </Grid>
      <Flex gap={2} justify="end" mt={4}>
        <Button size="sm" onClick={() => { setForm({ name: "", name_ar: "", slug: "", is_active: true }); setSelectedId(null); }}>تفريغ</Button>
        <Button size="sm" colorScheme="blue" onClick={saveCategory} isDisabled={!form.name && !form.name_ar}>{selectedId ? "تحديث" : "إضافة"} تصنيف</Button>
      </Flex>
      <Divider my={5} />
      <DynamicTable
        data={data}
        minPad="8px 8px"
        onActionClick={<RowActions onEdit={(row) => { setSelectedId(row.id); setForm(row); }} onDelete={(row) => deleteCategory(row.id)} />}
      />
    </Box>
  );
}

function Services() {
  const { register, handleSubmit, reset } = useForm();
  const empty = {
    title: "",
    title_ar: "",
    slug: "",
    small_description: "",
    small_description_ar: "",
    description: "",
    description_ar: "",
    sort_order: 0,
    is_active: true,
  };
  const [form, setForm] = useState(empty);
  const [selectedId, setSelectedId] = useState(null);
  const [image, setImage] = useState(null);
  const [isSavingSection, setIsSavingSection] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ["website-services"], queryFn: getServices });

  useEffect(() => {
    if (data?.section) reset(data.section);
  }, [data, reset]);

  const saveSection = async (values) => {
    try {
      setIsSavingSection(true);
      const res = await UPDATE(admin.token, "update_website_services_section", values);
      setIsSavingSection(false);
      if (res.response === 200) {
        ShowToast(toast, "success", "تم حفظ بيانات قسم الخدمات");
        queryClient.invalidateQueries(["website-services"]);
      } else {
        ShowToast(toast, "error", res.message);
      }
    } catch (error) {
      setIsSavingSection(false);
      ShowToast(toast, "error", JSON.stringify(error));
    }
  };

  const saveService = async () => {
    const endpoint = selectedId ? "update_website_service" : "add_website_service";
    const action = selectedId ? UPDATE : ADD;
    const payload = { ...form, id: selectedId };
    if (image) payload.image = image;

    const res = await action(admin.token, endpoint, payload);
    if (res.response === 200) {
      ShowToast(toast, "success", "تم حفظ الخدمة");
      setForm(empty);
      setSelectedId(null);
      setImage(null);
      queryClient.invalidateQueries(["website-services"]);
    } else {
      ShowToast(toast, "error", res.message);
    }
  };

  const deleteService = async (id) => {
    const res = await DELETE(admin.token, "delete_website_service", { id });
    if (res.response === 200) {
      ShowToast(toast, "success", "تم حذف الخدمة");
      queryClient.invalidateQueries(["website-services"]);
    }
  };

  if (isLoading) return <Skeleton h={400} />;

  return (
    <Box>
      <Box as="form" onSubmit={handleSubmit(saveSection)}>
        <SectionTitle title="بيانات قسم الخدمات" />
        <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
          <TranslatedInput label="عنوان القسم" enName="title" arName="title_ar" register={register} />
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <TranslatedTextarea label="وصف القسم" enName="description" arName="description_ar" register={register} />
          </GridItem>
        </Grid>
        <Flex justify="end" mt={4}>
          <Button type="submit" colorScheme="blue" isLoading={isSavingSection}>
            حفظ بيانات القسم
          </Button>
        </Flex>
      </Box>

      <Divider my={6} />
      <SectionTitle title={selectedId ? "تعديل خدمة" : "إضافة خدمة"} />
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
        <PlainInput label="عنوان الخدمة بالإنجليزي" value={form.title} onChange={(value) => setForm({ ...form, title: value })} dir="ltr" />
        <PlainInput label="عنوان الخدمة بالعربي" value={form.title_ar} onChange={(value) => setForm({ ...form, title_ar: value })} />
        <PlainInput label="الرابط المختصر" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} dir="ltr" />
        <PlainInput label="الترتيب" type="number" value={form.sort_order} onChange={(value) => setForm({ ...form, sort_order: value })} />
        <FormControl>
          <FormLabel>صورة الخدمة</FormLabel>
          <Input type="file" accept=".jpeg,.jpg,.png,.webp,.svg" onChange={(e) => setImage(e.target.files[0])} />
        </FormControl>
        <Checkbox isChecked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}>
          ظاهر
        </Checkbox>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <PlainTextarea label="الوصف المختصر بالإنجليزي" value={form.small_description} onChange={(value) => setForm({ ...form, small_description: value })} rows={2} dir="ltr" />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <PlainTextarea label="الوصف المختصر بالعربي" value={form.small_description_ar} onChange={(value) => setForm({ ...form, small_description_ar: value })} rows={2} />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <PlainTextarea label="الوصف الكبير بالإنجليزي" value={form.description} onChange={(value) => setForm({ ...form, description: value })} rows={7} dir="ltr" />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <PlainTextarea label="الوصف الكبير بالعربي" value={form.description_ar} onChange={(value) => setForm({ ...form, description_ar: value })} rows={7} />
        </GridItem>
      </Grid>
      <Flex gap={2} justify="end" mt={4}>
        <Button size="sm" onClick={() => { setForm(empty); setSelectedId(null); setImage(null); }}>
          تفريغ
        </Button>
        <Button size="sm" colorScheme="blue" onClick={saveService} isDisabled={!form.title && !form.title_ar}>
          {selectedId ? "تحديث" : "إضافة"} خدمة
        </Button>
      </Flex>

      <Divider my={5} />
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap={4}>
        {data?.services?.map((item) => (
          <Box key={item.id} borderWidth="1px" borderRadius={6} p={4}>
            <Flex justify="space-between" gap={3} align="start">
              <Box>
                <Text fontWeight="bold">{item.title}</Text>
                <Text fontSize="sm" color="gray.600" dir="ltr">{item.slug}</Text>
              </Box>
              <Badge colorScheme={item.is_active ? "green" : "gray"}>{item.is_active ? "ظاهر" : "مخفي"}</Badge>
            </Flex>
            {item.image && (
              <Image src={`${imageBaseURL}/${item.image}`} w="100%" h="130px" objectFit="cover" borderRadius={6} mt={3} />
            )}
            <Text mt={3} noOfLines={2}>{item.small_description}</Text>
            <Flex justify="end" gap={2} mt={4}>
              <Button size="xs" onClick={() => { setSelectedId(item.id); setForm(item); setImage(null); }}>تعديل</Button>
              <Button size="xs" colorScheme="red" onClick={() => deleteService(item.id)}>حذف</Button>
            </Flex>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}

function Blogs() {
  const empty = { title: "", title_ar: "", slug: "", blog_category_id: "", description: "", description_ar: "", content: "", content_ar: "", is_published: true };
  const [form, setForm] = useState(empty);
  const [selectedId, setSelectedId] = useState(null);
  const [image, setImage] = useState(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data: categories } = useQuery({ queryKey: ["blog-categories"], queryFn: getCategories });
  const { data, isLoading } = useQuery({ queryKey: ["blogs"], queryFn: getBlogs });

  const saveBlog = async () => {
    const endpoint = selectedId ? "update_blog" : "add_blog";
    const action = selectedId ? UPDATE : ADD;
    const payload = { ...form, id: selectedId };
    if (image) payload.image = image;
    const res = await action(admin.token, endpoint, payload);
    if (res.response === 200) {
      ShowToast(toast, "success", "تم حفظ المقال");
      setForm(empty);
      setSelectedId(null);
      setImage(null);
      queryClient.invalidateQueries(["blogs"]);
    } else {
      ShowToast(toast, "error", res.message);
    }
  };

  const deleteBlog = async (id) => {
    const res = await DELETE(admin.token, "delete_blog", { id });
    if (res.response === 200) {
      ShowToast(toast, "success", "تم حذف المقال");
      queryClient.invalidateQueries(["blogs"]);
    }
  };

  if (isLoading) return <Skeleton h={400} />;

  const tableData = data?.map((item) => ({
    id: item.id,
    title: item.title,
    title_ar: item.title_ar,
    category: item.category?.name,
    slug: item.slug,
    image: item.image,
    published: item.is_published ? "Yes" : "No",
    created_at: item.created_at,
  }));

  return (
    <Box>
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={3}>
        <PlainInput label="العنوان بالإنجليزي" value={form.title} onChange={(value) => setForm({ ...form, title: value })} dir="ltr" />
        <PlainInput label="العنوان بالعربي" value={form.title_ar} onChange={(value) => setForm({ ...form, title_ar: value })} />
        <PlainInput label="الرابط المختصر" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} dir="ltr" />
        <FormControl>
          <FormLabel>التصنيف</FormLabel>
          <Select value={form.blog_category_id || ""} onChange={(e) => setForm({ ...form, blog_category_id: e.target.value })}>
            <option value="">اختر التصنيف</option>
            {categories?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>الصورة</FormLabel>
          <Input type="file" accept=".jpeg,.jpg,.png,.webp,.svg" onChange={(e) => setImage(e.target.files[0])} />
        </FormControl>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <PlainTextarea label="الوصف المختصر بالإنجليزي" value={form.description} onChange={(value) => setForm({ ...form, description: value })} dir="ltr" />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <PlainTextarea label="الوصف المختصر بالعربي" value={form.description_ar} onChange={(value) => setForm({ ...form, description_ar: value })} />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <PlainTextarea label="محتوى المقال بالإنجليزي" value={form.content} onChange={(value) => setForm({ ...form, content: value })} rows={8} dir="ltr" />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <PlainTextarea label="محتوى المقال بالعربي" value={form.content_ar} onChange={(value) => setForm({ ...form, content_ar: value })} rows={8} />
        </GridItem>
        <Checkbox isChecked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })}>
          منشور
        </Checkbox>
      </Grid>
      <Flex gap={2} justify="end" mt={4}>
        <Button size="sm" onClick={() => { setForm(empty); setSelectedId(null); setImage(null); }}>تفريغ</Button>
        <Button size="sm" colorScheme="blue" onClick={saveBlog} isDisabled={!form.title && !form.title_ar}>{selectedId ? "تحديث" : "إضافة"} مقال</Button>
      </Flex>
      <Divider my={5} />
      <DynamicTable
        data={tableData}
        minPad="8px 8px"
        onActionClick={<RowActions onEdit={(row) => {
      const original = data.find((item) => item.id === row.id);
      setSelectedId(row.id);
      setForm(original);
        }} onDelete={(row) => deleteBlog(row.id)} />}
      />
    </Box>
  );
}

function ContactMessages() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ["website-contact-messages"], queryFn: getMessages });

  const updateStatus = async (row, status) => {
      const res = await UPDATE(admin.token, "update_website_contact_message_status", { id: row.id, status });
    if (res.response === 200) {
      ShowToast(toast, "success", "تم تحديث حالة الرسالة");
      queryClient.invalidateQueries(["website-contact-messages"]);
    }
  };

  const deleteMessage = async (row) => {
    const res = await DELETE(admin.token, "delete_website_contact_message", { id: row.id });
    if (res.response === 200) {
      ShowToast(toast, "success", "تم حذف الرسالة");
      queryClient.invalidateQueries(["website-contact-messages"]);
    }
  };

  if (isLoading) return <Skeleton h={300} />;

  return (
    <DynamicTable
      data={data}
      minPad="8px 8px"
      onActionClick={<MessageActions onRead={(row) => updateStatus(row, "read")} onDelete={deleteMessage} />}
    />
  );
}

function Faqs() {
  const empty = { question: "", question_ar: "", answer: "", answer_ar: "", sort_order: 0, is_active: true };
  const [form, setForm] = useState(empty);
  const [selectedId, setSelectedId] = useState(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ["website-faqs"], queryFn: getFaqs });

  const saveFaq = async () => {
    const endpoint = selectedId ? "update_website_faq" : "add_website_faq";
    const action = selectedId ? UPDATE : ADD;
    const res = await action(admin.token, endpoint, { ...form, id: selectedId });

    if (res.response === 200) {
      ShowToast(toast, "success", "تم حفظ السؤال");
      setForm(empty);
      setSelectedId(null);
      queryClient.invalidateQueries(["website-faqs"]);
    } else {
      ShowToast(toast, "error", res.message);
    }
  };

  const deleteFaq = async (id) => {
    const res = await DELETE(admin.token, "delete_website_faq", { id });
    if (res.response === 200) {
      ShowToast(toast, "success", "تم حذف السؤال");
      queryClient.invalidateQueries(["website-faqs"]);
    }
  };

  if (isLoading) return <Skeleton h={300} />;

  return (
    <Box>
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 120px 120px" }} gap={3} alignItems="end">
        <PlainInput label="السؤال بالإنجليزي" value={form.question} onChange={(value) => setForm({ ...form, question: value })} dir="ltr" />
        <PlainInput label="السؤال بالعربي" value={form.question_ar} onChange={(value) => setForm({ ...form, question_ar: value })} />
        <PlainInput label="الترتيب" type="number" value={form.sort_order} onChange={(value) => setForm({ ...form, sort_order: value })} />
        <Checkbox isChecked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}>
          ظاهر
        </Checkbox>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <PlainTextarea label="الإجابة بالإنجليزي" value={form.answer} onChange={(value) => setForm({ ...form, answer: value })} rows={3} dir="ltr" />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <PlainTextarea label="الإجابة بالعربي" value={form.answer_ar} onChange={(value) => setForm({ ...form, answer_ar: value })} rows={3} />
        </GridItem>
      </Grid>
      <Flex gap={2} justify="end" mt={4}>
        <Button size="sm" onClick={() => { setForm(empty); setSelectedId(null); }}>
          تفريغ
        </Button>
        <Button size="sm" colorScheme="blue" onClick={saveFaq} isDisabled={(!form.question && !form.question_ar) || (!form.answer && !form.answer_ar)}>
          {selectedId ? "تحديث" : "إضافة"} سؤال
        </Button>
      </Flex>
      <Divider my={5} />
      <DynamicTable
        data={data}
        minPad="8px 8px"
        onActionClick={<RowActions onEdit={(row) => { setSelectedId(row.id); setForm(row); }} onDelete={(row) => deleteFaq(row.id)} />}
      />
    </Box>
  );
}

function SectionTitle({ title }) {
  return (
    <Heading size="sm" mt={6} mb={4}>
      {title}
    </Heading>
  );
}

function InputField({ label, name, register, dir = "rtl" }) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input dir={dir} {...register(name)} />
    </FormControl>
  );
}

function TextareaField({ label, name, register, dir = "rtl" }) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Textarea dir={dir} {...register(name)} />
    </FormControl>
  );
}

function TranslatedInput({ label, enName, arName, register }) {
  return (
    <>
      <InputField label={`${label} بالإنجليزي`} name={enName} register={register} dir="ltr" />
      <InputField label={`${label} بالعربي`} name={arName} register={register} />
    </>
  );
}

function TranslatedTextarea({ label, enName, arName, register }) {
  return (
    <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
      <TextareaField label={`${label} بالإنجليزي`} name={enName} register={register} dir="ltr" />
      <TextareaField label={`${label} بالعربي`} name={arName} register={register} />
    </Grid>
  );
}

function PlainInput({ label, value, onChange, type = "text", dir = "rtl" }) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input dir={dir} type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </FormControl>
  );
}

function PlainTextarea({ label, value, onChange, rows = 4, dir = "rtl" }) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Textarea dir={dir} rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </FormControl>
  );
}

function ImageInput({ label, name, onChange }) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input
        type="file"
        accept=".jpeg,.jpg,.png,.webp,.svg"
        onChange={(e) => onChange((current) => ({ ...current, [name]: e.target.files[0] }))}
      />
    </FormControl>
  );
}

function RowActions({ rowData, onEdit, onDelete }) {
  return (
    <Flex justify="center" gap={2}>
      <Button size="xs" onClick={() => onEdit(rowData)}>تعديل</Button>
      <Button size="xs" colorScheme="red" onClick={() => onDelete(rowData)}>حذف</Button>
    </Flex>
  );
}

function MessageActions({ rowData, onRead, onDelete }) {
  return (
    <Flex justify="center" gap={2}>
      <Button size="xs" onClick={() => onRead(rowData)}>مقروءة</Button>
      <Button size="xs" colorScheme="red" onClick={() => onDelete(rowData)}>حذف</Button>
    </Flex>
  );
}
