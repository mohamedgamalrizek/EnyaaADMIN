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
    <Box>
      <Heading size="md" mb={5}>
        Website Management
      </Heading>
      <Tabs colorScheme="blue" isLazy>
        <TabList overflowX="auto">
          <Tab>Home Content</Tab>
          <Tab>About Us</Tab>
          <Tab>Section Icons</Tab>
          <Tab>Blogs</Tab>
          <Tab>Categories</Tab>
          <Tab>FAQ</Tab>
          <Tab>Contact Messages</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <HomeContent />
          </TabPanel>
          <TabPanel px={0}>
            <AboutUs />
          </TabPanel>
          <TabPanel px={0}>
            <HomeFeatures />
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
        ShowToast(toast, "success", "Home content updated");
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
      ShowToast(toast, "success", "Hero banner removed");
      queryClient.invalidateQueries(["website-home"]);
    }
  };

  if (isFetching) return <Skeleton h={400} />;

  return (
    <Box as="form" onSubmit={handleSubmit(handleUpdate)}>
      <SectionTitle title="Hero Section" />
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
        <InputField label="Hero Title" name="hero_title" register={register} />
        <InputField label="Button Text" name="hero_button_text" register={register} />
        <InputField label="Button Href" name="hero_button_href" register={register} />
        <FormControl>
          <FormLabel>Hero Banner</FormLabel>
          <Input type="file" accept=".jpeg,.jpg,.png,.webp,.svg" onChange={(e) => setHeroBanner(e.target.files[0])} />
        </FormControl>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <TextareaField label="Description" name="hero_description" register={register} />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <TextareaField label="Sub Description" name="hero_sub_description" register={register} />
        </GridItem>
      </Grid>
      {data?.content?.hero_banner && (
        <Flex mt={4} gap={4} align="center">
          <Image src={`${imageBaseURL}/${data.content.hero_banner}`} boxSize="90px" objectFit="cover" borderRadius={6} />
          <Button size="sm" colorScheme="red" onClick={removeBanner}>
            Remove Banner
          </Button>
        </Flex>
      )}

      <SectionTitle title="Second Section" />
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
        <InputField label="Section Title" name="features_title" register={register} />
        <TextareaField label="Section Description" name="features_description" register={register} />
      </Grid>

      <SectionTitle title="Third Section" />
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
        <InputField label="Section Title" name="cta_title" register={register} />
        <InputField label="Button Text" name="cta_button_text" register={register} />
        <InputField label="Button Href" name="cta_button_href" register={register} />
        <TextareaField label="Section Description" name="cta_description" register={register} />
        <InputField label="First Subtitle Icon" name="cta_first_icon" register={register} />
        <InputField label="First Subtitle" name="cta_first_title" register={register} />
        <InputField label="Second Subtitle Icon" name="cta_second_icon" register={register} />
        <InputField label="Second Subtitle" name="cta_second_title" register={register} />
      </Grid>

      <Flex justify="end" mt={6}>
        <Button type="submit" colorScheme="blue" isLoading={isLoading}>
          Save
        </Button>
      </Flex>
    </Box>
  );
}

function HomeFeatures() {
  const empty = { icon: "", title: "", description: "", sort_order: 0, is_active: true };
  const [form, setForm] = useState(empty);
  const [selectedId, setSelectedId] = useState(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ["website-home"], queryFn: getWebsiteHome });

  const saveFeature = async () => {
    const endpoint = selectedId ? "update_website_home_feature" : "add_website_home_feature";
    const action = selectedId ? UPDATE : ADD;
    const res = await action(admin.token, endpoint, { ...form, id: selectedId });
    if (res.response === 200) {
      ShowToast(toast, "success", "Feature saved");
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
      ShowToast(toast, "success", "Feature deleted");
      queryClient.invalidateQueries(["website-home"]);
    }
  };

  if (isLoading) return <Skeleton h={300} />;

  return (
    <Box>
      <Grid templateColumns={{ base: "1fr", lg: "120px 1fr 1fr 120px 120px" }} gap={3} alignItems="end">
        <PlainInput label="Icon" value={form.icon} onChange={(value) => setForm({ ...form, icon: value })} />
        <PlainInput label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
        <PlainInput label="Description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
        <PlainInput label="Order" type="number" value={form.sort_order} onChange={(value) => setForm({ ...form, sort_order: value })} />
        <Checkbox isChecked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}>
          Active
        </Checkbox>
      </Grid>
      <Flex gap={2} justify="end" mt={4}>
        <Button size="sm" onClick={() => { setForm(empty); setSelectedId(null); }}>
          Clear
        </Button>
        <Button size="sm" colorScheme="blue" onClick={saveFeature} isDisabled={!form.title}>
          {selectedId ? "Update" : "Add"} Feature
        </Button>
      </Flex>
      <Divider my={5} />
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap={4}>
        {data?.features?.map((item) => (
          <Box key={item.id} borderWidth="1px" borderRadius={6} p={4}>
            <Flex justify="space-between" gap={3}>
              <Text fontWeight="bold">{item.title}</Text>
              <Badge colorScheme={item.is_active ? "green" : "gray"}>{item.is_active ? "Active" : "Hidden"}</Badge>
            </Flex>
            <Text fontSize="sm" color="gray.600" mt={1}>{item.icon}</Text>
            <Text mt={2}>{item.description}</Text>
            <Flex justify="end" gap={2} mt={4}>
              <Button size="xs" onClick={() => { setSelectedId(item.id); setForm(item); }}>Edit</Button>
              <Button size="xs" colorScheme="red" onClick={() => deleteFeature(item.id)}>Delete</Button>
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
        ShowToast(toast, "success", "About us content updated");
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
      <SectionTitle title="Main Description" />
      <TextareaField label="Description" name="description" register={register} />

      <SectionTitle title="First Section" />
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
        <InputField label="Title" name="section_one_title" register={register} />
        <FormControl>
          <FormLabel>Images</FormLabel>
          <Input
            type="file"
            multiple
            accept=".jpeg,.jpg,.png,.webp,.svg"
            onChange={(e) => setSectionOneImages(Array.from(e.target.files))}
          />
        </FormControl>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <TextareaField label="Description" name="section_one_description" register={register} />
        </GridItem>
      </Grid>
      {!!data?.section_one_images?.length && (
        <Flex mt={4} gap={3} wrap="wrap">
          {data.section_one_images.map((image) => (
            <Image key={image} src={`${imageBaseURL}/${image}`} boxSize="90px" objectFit="cover" borderRadius={6} />
          ))}
        </Flex>
      )}

      <SectionTitle title="Second Section" />
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
        <InputField label="Title" name="section_two_title" register={register} />
        <ImageInput label="Image One" name="section_two_image_one" onChange={setSectionTwoImages} />
        <TextareaField label="Description One" name="section_two_description_one" register={register} />
        <ImageInput label="Image Two" name="section_two_image_two" onChange={setSectionTwoImages} />
        <TextareaField label="Description Two" name="section_two_description_two" register={register} />
        <ImageInput label="Image Three" name="section_two_image_three" onChange={setSectionTwoImages} />
        <TextareaField label="Description Three" name="section_two_description_three" register={register} />
      </Grid>
      <Flex mt={4} gap={3} wrap="wrap">
        {["section_two_image_one", "section_two_image_two", "section_two_image_three"].map((field) => (
          data?.[field] ? <Image key={field} src={`${imageBaseURL}/${data[field]}`} boxSize="90px" objectFit="cover" borderRadius={6} /> : null
        ))}
      </Flex>

      <Flex justify="end" mt={6}>
        <Button type="submit" colorScheme="blue" isLoading={isSaving}>
          Save
        </Button>
      </Flex>
    </Box>
  );
}

function Categories() {
  const [form, setForm] = useState({ name: "", slug: "", is_active: true });
  const [selectedId, setSelectedId] = useState(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ["blog-categories"], queryFn: getCategories });

  const saveCategory = async () => {
    const endpoint = selectedId ? "update_blog_category" : "add_blog_category";
    const action = selectedId ? UPDATE : ADD;
    const res = await action(admin.token, endpoint, { ...form, id: selectedId });
    if (res.response === 200) {
      ShowToast(toast, "success", "Category saved");
      setForm({ name: "", slug: "", is_active: true });
      setSelectedId(null);
      queryClient.invalidateQueries(["blog-categories"]);
    } else {
      ShowToast(toast, "error", res.message);
    }
  };

  const deleteCategory = async (id) => {
    const res = await DELETE(admin.token, "delete_blog_category", { id });
    if (res.response === 200) {
      ShowToast(toast, "success", "Category deleted");
      queryClient.invalidateQueries(["blog-categories"]);
    }
  };

  if (isLoading) return <Skeleton h={300} />;

  return (
    <Box>
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 120px" }} gap={3} alignItems="end">
        <PlainInput label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
        <PlainInput label="Slug" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} />
        <Checkbox isChecked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}>
          Active
        </Checkbox>
      </Grid>
      <Flex gap={2} justify="end" mt={4}>
        <Button size="sm" onClick={() => { setForm({ name: "", slug: "", is_active: true }); setSelectedId(null); }}>Clear</Button>
        <Button size="sm" colorScheme="blue" onClick={saveCategory} isDisabled={!form.name}>{selectedId ? "Update" : "Add"} Category</Button>
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

function Blogs() {
  const empty = { title: "", slug: "", blog_category_id: "", description: "", content: "", is_published: true };
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
      ShowToast(toast, "success", "Blog saved");
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
      ShowToast(toast, "success", "Blog deleted");
      queryClient.invalidateQueries(["blogs"]);
    }
  };

  if (isLoading) return <Skeleton h={400} />;

  const tableData = data?.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category?.name,
    slug: item.slug,
    image: item.image,
    published: item.is_published ? "Yes" : "No",
    created_at: item.created_at,
  }));

  return (
    <Box>
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={3}>
        <PlainInput label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
        <PlainInput label="Slug" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} />
        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select value={form.blog_category_id || ""} onChange={(e) => setForm({ ...form, blog_category_id: e.target.value })}>
            <option value="">Select Category</option>
            {categories?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Image</FormLabel>
          <Input type="file" accept=".jpeg,.jpg,.png,.webp,.svg" onChange={(e) => setImage(e.target.files[0])} />
        </FormControl>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <PlainTextarea label="Description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <PlainTextarea label="Content" value={form.content} onChange={(value) => setForm({ ...form, content: value })} rows={8} />
        </GridItem>
        <Checkbox isChecked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })}>
          Published
        </Checkbox>
      </Grid>
      <Flex gap={2} justify="end" mt={4}>
        <Button size="sm" onClick={() => { setForm(empty); setSelectedId(null); setImage(null); }}>Clear</Button>
        <Button size="sm" colorScheme="blue" onClick={saveBlog} isDisabled={!form.title}>{selectedId ? "Update" : "Add"} Blog</Button>
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
      ShowToast(toast, "success", "Message status updated");
      queryClient.invalidateQueries(["website-contact-messages"]);
    }
  };

  const deleteMessage = async (row) => {
    const res = await DELETE(admin.token, "delete_website_contact_message", { id: row.id });
    if (res.response === 200) {
      ShowToast(toast, "success", "Message deleted");
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
  const empty = { question: "", answer: "", sort_order: 0, is_active: true };
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
      ShowToast(toast, "success", "FAQ saved");
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
      ShowToast(toast, "success", "FAQ deleted");
      queryClient.invalidateQueries(["website-faqs"]);
    }
  };

  if (isLoading) return <Skeleton h={300} />;

  return (
    <Box>
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 120px 120px" }} gap={3} alignItems="end">
        <PlainInput label="Question" value={form.question} onChange={(value) => setForm({ ...form, question: value })} />
        <PlainTextarea label="Answer" value={form.answer} onChange={(value) => setForm({ ...form, answer: value })} rows={2} />
        <PlainInput label="Order" type="number" value={form.sort_order} onChange={(value) => setForm({ ...form, sort_order: value })} />
        <Checkbox isChecked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}>
          Active
        </Checkbox>
      </Grid>
      <Flex gap={2} justify="end" mt={4}>
        <Button size="sm" onClick={() => { setForm(empty); setSelectedId(null); }}>
          Clear
        </Button>
        <Button size="sm" colorScheme="blue" onClick={saveFaq} isDisabled={!form.question || !form.answer}>
          {selectedId ? "Update" : "Add"} FAQ
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

function InputField({ label, name, register }) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input {...register(name)} />
    </FormControl>
  );
}

function TextareaField({ label, name, register }) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Textarea {...register(name)} />
    </FormControl>
  );
}

function PlainInput({ label, value, onChange, type = "text" }) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </FormControl>
  );
}

function PlainTextarea({ label, value, onChange, rows = 4 }) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Textarea rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)} />
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
      <Button size="xs" onClick={() => onEdit(rowData)}>Edit</Button>
      <Button size="xs" colorScheme="red" onClick={() => onDelete(rowData)}>Delete</Button>
    </Flex>
  );
}

function MessageActions({ rowData, onRead, onDelete }) {
  return (
    <Flex justify="center" gap={2}>
      <Button size="xs" onClick={() => onRead(rowData)}>Read</Button>
      <Button size="xs" colorScheme="red" onClick={() => onDelete(rowData)}>Delete</Button>
    </Flex>
  );
}
