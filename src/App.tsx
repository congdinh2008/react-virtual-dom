import { useState, useEffect } from 'react'

// Cấu trúc dữ liệu sản phẩm sữa
interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  numberOfOrder: number;
  isQualityTested: boolean;
  isBribed: boolean;
}

// Danh sách ảnh có sẵn trong thư mục assets/images
interface ProductImage {
  name: string; // Tên hiển thị
  path: string; // Đường dẫn tới file ảnh
}

// Component hiển thị chi tiết sản phẩm sữa
const Item = ({
  item,
  onRemove,
  onOrderChange,
  useColorfulStyles
}: {
  item: Product,
  onRemove: (id: string) => void,
  onOrderChange: (id: string, change: number) => void,
  useColorfulStyles: boolean
}) => {
  // Xác định class dựa trên thuộc tính chất lượng và tùy chọn style
  const getItemBgClass = () => {
    if (!useColorfulStyles) {
      return 'border-l-4 border-l-gray-300 bg-white';
    }

    if (item.isBribed) return 'border-l-4 border-l-red-500 bg-red-50';
    if (item.isQualityTested) return 'border-l-4 border-l-green-500 bg-green-50';
    return 'border-l-4 border-l-yellow-500 bg-yellow-50';
  };

  // Xác định class cho badge dựa trên thuộc tính chất lượng và tùy chọn style
  const getQualityBadgeClass = () => {
    if (!useColorfulStyles) {
      return 'bg-gray-500 text-white';
    }

    return item.isQualityTested ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-800';
  };

  const getBribedBadgeClass = () => {
    if (!useColorfulStyles) {
      return 'bg-gray-500 text-white';
    }

    return item.isBribed ? 'bg-red-500 text-white' : 'bg-green-500 text-white';
  };

  return (
    <div className={`flex p-4 my-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ${getItemBgClass()}`}>
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-lg mr-4 shadow-sm"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x120?text=Không+có+ảnh';
        }}
      />

      <div className="flex-1 flex flex-col justify-center text-left">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">{item.description}</p>
        <div className="flex flex-wrap gap-2">
          <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${getQualityBadgeClass()}`}>
            {item.isQualityTested ? 'Đã kiểm định chất lượng' : 'Chưa kiểm định'}
          </span>

          <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${getBribedBadgeClass()}`}>
            {item.isBribed ? 'Chất lượng không đảm bảo' : 'Chất lượng tiêu chuẩn'}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-3 w-28">
        <button
          onClick={() => onRemove(item.id)}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded text-sm font-medium transition-colors"
        >
          Xóa
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onOrderChange(item.id, -1)}
            disabled={item.numberOfOrder <= 0}
            className="flex items-center justify-center w-7 h-7 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-bold transition-colors"
          >
            -
          </button>

          <span className="mx-2 font-bold text-gray-700 min-w-6 text-center">{item.numberOfOrder}</span>

          <button
            onClick={() => onOrderChange(item.id, 1)}
            className="flex items-center justify-center w-7 h-7 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

// Component hiển thị danh sách sản phẩm sữa
const List = ({
  items,
  onRemove,
  onOrderChange
}: {
  items: Product[],
  onRemove: (id: string) => void,
  onOrderChange: (id: string, change: number) => void
}) => {
  // State cho việc hiển thị theo màu sắc phân biệt
  const [useColorfulStyles, setUseColorfulStyles] = useState(true);

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [qualityFilter, setQualityFilter] = useState('all'); // 'all', 'tested', 'untested'
  const [bribedFilter, setBribedFilter] = useState('all'); // 'all', 'bribed', 'standard'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'orders'

  // Lọc và sắp xếp danh sách sữa
  const filteredAndSortedItems = () => {
    let result = [...items];

    // Tìm kiếm theo tên hoặc mô tả
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    }

    // Lọc theo trạng thái kiểm định
    if (qualityFilter !== 'all') {
      result = result.filter(item =>
        (qualityFilter === 'tested' && item.isQualityTested) ||
        (qualityFilter === 'untested' && !item.isQualityTested)
      );
    }

    // Lọc theo trạng thái hối lộ
    if (bribedFilter !== 'all') {
      result = result.filter(item =>
        (bribedFilter === 'bribed' && item.isBribed) ||
        (bribedFilter === 'standard' && !item.isBribed)
      );
    }

    // Sắp xếp
    result.sort((a, b) => {
      if (sortBy === 'orders') {
        return b.numberOfOrder - a.numberOfOrder;
      }
      // Mặc định sắp xếp theo tên
      return a.name.localeCompare(b.name);
    });

    return result;
  };

  const displayedItems = filteredAndSortedItems();

  if (items.length === 0) {
    return <p className="text-gray-500 italic">Chưa có sản phẩm sữa nào được thêm vào.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-red-500">
      <h2 className="text-2xl font-bold text-red-600 mb-4 text-left">Danh sách sản phẩm sữa</h2>

      {/* Bộ lọc và tìm kiếm */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm:</label>
            <input
              type="text"
              id="search"
              placeholder="Nhập tên hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236b7280%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m6 8 4 4 4-4%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-no-repeat bg-[right_0.5rem_center] pr-10"
            >
              <option value="name">Tên sản phẩm</option>
              <option value="orders">Số lượng đặt hàng</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="qualityFilter" className="block text-sm font-medium text-gray-700 mb-1">Lọc theo kiểm định:</label>
            <select
              id="qualityFilter"
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236b7280%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m6 8 4 4 4-4%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-no-repeat bg-[right_0.5rem_center] pr-10"
            >
              <option value="all">Tất cả sản phẩm</option>
              <option value="tested">Đã kiểm định</option>
              <option value="untested">Chưa kiểm định</option>
            </select>
          </div>

          <div>
            <label htmlFor="bribedFilter" className="block text-sm font-medium text-gray-700 mb-1">Lọc theo chất lượng:</label>
            <select
              id="bribedFilter"
              value={bribedFilter}
              onChange={(e) => setBribedFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236b7280%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m6 8 4 4 4-4%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-no-repeat bg-[right_0.5rem_center] pr-10"
            >
              <option value="all">Tất cả sản phẩm</option>
              <option value="standard">Chất lượng tiêu chuẩn</option>
              <option value="bribed">Chất lượng không đảm bảo</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              id="useColorfulStyles"
              type="checkbox"
              checked={useColorfulStyles}
              onChange={(e) => setUseColorfulStyles(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2"
            />
            <label htmlFor="useColorfulStyles" className="text-sm font-medium text-gray-700">
              Hiển thị phân biệt theo chất lượng
            </label>
          </div>
        </div>
      </div>

      {/* Hiển thị số lượng kết quả */}
      <p className="text-sm text-gray-500 mb-4">
        Hiển thị {displayedItems.length} / {items.length} sản phẩm
      </p>

      {/* Danh sách sản phẩm */}
      {displayedItems.length > 0 ? (
        displayedItems.map(item => (
          <Item
            key={item.id}
            item={item}
            onRemove={onRemove}
            onOrderChange={onOrderChange}
            useColorfulStyles={useColorfulStyles}
          />
        ))
      ) : (
        <p className="text-gray-500 italic py-4">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
      )}
    </div>
  );
};

const App = () => {
  // State cho form nhập thông tin sữa
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [isQualityTested, setIsQualityTested] = useState(true);
  const [isBribed, setIsBribed] = useState(false);

  // State cho danh sách sữa
  const [products, setProducts] = useState<Product[]>([]);

  // Danh sách hình ảnh có sẵn
  const [availableImages] = useState<ProductImage[]>([
    { name: "Abbott Grow", path: "/src/assets/images/abbott-grow.jpg" },
    { name: "Cô Gái Hà Lan", path: "/src/assets/images/co-gai-ha-lan.jpg" },
    { name: "Enlene", path: "/src/assets/images/enlene.jpg" },
    { name: "Ensure UC", path: "/src/assets/images/ensure-uc.jpg" },
    { name: "Hofumil (Hàng giả)", path: "/src/assets/images/hofumil-fake.webp" },
    { name: "Nitrogen (Hàng giả)", path: "/src/assets/images/nitrogen-fake.jpeg" },
    { name: "Nutifood Grow Plus", path: "/src/assets/images/nutifood-grow-plus.jpg" },
    { name: "Soramilk (Hàng giả)", path: "/src/assets/images/soramilk-fake.jpg" },
    { name: "Sure IQ (Hàng giả)", path: "/src/assets/images/sure-iq-fake.jpg" },
    { name: "TH True Milk", path: "/src/assets/images/th-true-milk.jpeg" }
  ]);

  // Cập nhật URL ảnh khi chọn ảnh từ danh sách
  useEffect(() => {
    if (selectedImage) {
      setImageUrl(selectedImage);
    }
  }, [selectedImage]);

  // Thêm sản phẩm sữa mới
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !imageUrl.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const newItem: Product = {
      id: Date.now().toString(),
      name,
      description,
      imageUrl,
      numberOfOrder: 0,
      isQualityTested,
      isBribed
    };

    setProducts([...products, newItem]);

    // Reset form
    setName('');
    setDescription('');
    setImageUrl('');
    setSelectedImage('');
    setIsQualityTested(true);
    setIsBribed(false);
  };

  // Xóa sản phẩm sữa
  const handleDelete = (id: string) => {
    setProducts(products.filter(item => item.id !== id));
  };

  // Thay đổi số lượng đặt hàng
  const handleOrderChange = (id: string, change: number) => {
    setProducts(products.map(item =>
      item.id === id
        ? {
          ...item,
          numberOfOrder: Math.max(0, item.numberOfOrder + change)
        }
        : item
    ));
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Thị Trường Sữa</h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8 border-t-4 border-t-blue-500">
        <form onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-1">Tên Sản Phẩm</label>
              <input
                id="name"
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên sản phẩm sữa"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="imageSelect" className="text-sm font-semibold text-gray-700 mb-1">Chọn Hình Ảnh</label>
              <select
                id="imageSelect"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236b7280%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m6 8 4 4 4-4%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-no-repeat bg-[right_0.5rem_center] pr-10"
                value={selectedImage}
                onChange={(e) => setSelectedImage(e.target.value)}
              >
                <option value="">-- Chọn ảnh --</option>
                {availableImages.map((img, index) => (
                  <option key={index} value={img.path}>
                    {img.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col col-span-full">
              <label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-1">Mô Tả</label>
              <textarea
                id="description"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-h-24 resize-y"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả sản phẩm sữa"
                rows={2}
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="imageUrl" className="text-sm font-semibold text-gray-700 mb-1">URL Hình Ảnh (tùy chọn)</label>
              <input
                id="imageUrl"
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Nhập URL hình ảnh"
              />
            </div>

            <div className="flex flex-col justify-end">
              {selectedImage && (
                <div className="flex flex-col items-start mt-2">
                  <img
                    src={selectedImage}
                    alt="Ảnh xem trước"
                    className="w-20 h-20 object-cover rounded-md shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="col-span-full">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-start">
                  <input
                    id="isQualityTested"
                    type="checkbox"
                    className="mt-1 mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={isQualityTested}
                    onChange={(e) => setIsQualityTested(e.target.checked)}
                  />
                  <div>
                    <label htmlFor="isQualityTested" className="font-medium text-gray-700">Đã kiểm định chất lượng</label>
                    <p className="text-xs text-gray-500 italic mt-0.5">Quản lý thị trường đã ghé thăm</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    id="isBribed"
                    type="checkbox"
                    className="mt-1 mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={isBribed}
                    onChange={(e) => setIsBribed(e.target.checked)}
                  />
                  <div>
                    <label htmlFor="isBribed" className="font-medium text-gray-700">Chất lượng không đảm bảo</label>
                    <p className="text-xs text-gray-500 italic mt-0.5">Quản lý thị trường quên ghé thăm từ 2021</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-full mt-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md font-semibold transition-colors shadow-sm"
              >
                Thêm Sản Phẩm
              </button>
            </div>
          </div>
        </form>
      </div>

      <List
        items={products}
        onRemove={handleDelete}
        onOrderChange={handleOrderChange}
      />
    </div>
  );
}

export default App
