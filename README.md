<h1 align='center'>Vite + React + TypeScript + Eslint + Prettier Template ⚡</h1>

Create a new project with Vite, React JS, TypeScript, Eslint, Prettier in just 1 second and you don't need to setup anything.

![image](https://user-images.githubusercontent.com/70432453/170648662-2ff424b9-74e9-4754-a04d-512fe1496a3b.png)

## **Some Features 📋**

Alias Import

![image](https://user-images.githubusercontent.com/70432453/170644457-ede03cca-44e9-4543-94d3-412c9d317063.png)

Hook Warning

![image](https://user-images.githubusercontent.com/70432453/170638708-23a20ffd-156e-494a-84be-b1e1cfdb5c93.png)

Prettier Warning

![image](https://user-images.githubusercontent.com/70432453/170639043-24423ed1-73cc-4730-b270-2acea1ae0c74.png)

Etc...

## **Using 📦**

1. Install Packages

```
yarn install
```

2. Start Project

```
yarn dev
```

## Rules & conventions

- [ ] ESLints _(AirBnb Config)_
- [ ] prettier
      **React/JSX**

## Những luật cơ bản

- Chỉ chứa một React Component trong 1 file.
- Luôn luôn sử dụng cú pháp JSX.
- Không sử dụng `React.createElement` chung với cú pháp JSX.

## So sánh class vs `React.createClass` vs stateless

- Nếu Component có state hoặc refs, nên sử dụng `class extends React.Component` thay vì `React.createClass`.(eslint)

  ```jsx
  // tệ
  const Listing = React.createClass({
    // ...
    render() {
      return <div>{this.state.hello}</div>;
    },
  });

  // tốt
  class Listing extends React.Component {
    // ...
    render() {
      return <div>{this.state.hello}</div>;
    }
  }
  ```

  Và nếu trong Component không có state hoặc refs, nên sử dụng khai báo hàm (không phải arrow function) thay vì class:

  ```jsx
  // tệ
  class Listing extends React.Component {
    render() {
      return <div>{this.props.hello}</div>;
    }
  }

  // tệ (dựa vào tên hàm để suy luận thì rất đau đầu)
  const Listing = ({ hello }) => <div>{hello}</div>;

  // tốt
  function Listing({ hello }) {
    return <div>{hello}</div>;
  }
  ```

## Đặt tên

- **Phần mở rộng(extensions)**: Sử dụng phần mở rộng `.js` cho React Components.
- **Tên file**: Sử dụng chuẩn PascalCase cho tên file. Ví dụ: `ReservationCard.js`.
- **Tên tham chiếu(Reference Naming)**: Sử dụng PascalCase cho React components và dùng camelCase cho các đối tượng(instances) của chúng.(eslint + Prettier)

  ```jsx
  // tệ
  import reservationCard from './ReservationCard';

  // tốt
  import ReservationCard from './ReservationCard';

  // tệ
  const ReservationItem = <ReservationCard />;

  // tốt
  const reservationItem = <ReservationCard />;
  ```

- **Đặt tên Component**: Sử dụng tên file trùng với tên component.

  ```jsx
  // tệ
  import Footer from './Footer/Footer';

  // tệ
  import Footer from './Footer/index';

  // tốt
  import Footer from './Footer';
  ```

- **Đặt tên Props**: Tránh sử dụng tên props của DOM Component cho mục đích khác.

  ```jsx
  // tệ
  <MyComponent style="fancy" />

  // tệ
  <MyComponent className="fancy" />

  // tốt
  <MyComponent variant="fancy" />
  ```

## Khai báo

- Không nên sử dụng `displayName` để đặt tên cho các Components. Thay vào đó, đặt tên cho các Components bằng references(tham chiếu).

  ```jsx
  // tệ
  export default React.createClass({
    displayName: "ReservationCard",
    // một số thứ khác
  });

  // tốt
  export default class ReservationCard extends React.Component {}
  ```

## Căn chỉnh mã nguồn

- Căn chỉnh cho cú pháp JS. (eslint + Prettier)

  ```jsx
  // tệ
  <Foo superLongParam="bar"
       anotherSuperLongParam="baz" />

  // tốt
  <Foo
    superLongParam="bar"
    anotherSuperLongParam="baz"
  />

  // Nếu props phù hợp trong một dòng thì giữ nó trên cùng một dòng
  <Foo bar="bar" />

  // Component con được thụt lề bình thường
  <Foo
    superLongParam="bar"
    anotherSuperLongParam="baz"
  >
    <Quux />
  </Foo>
  ```

## Dấu nháy đơn và nháy kép

- Luôn luôn sử dụng dấu ngoặc kép (`"`) cho các thuộc tính JSX, nhưng dấu nháy đơn (`'`) cho tất cả các JS khác. Eslint: (Prettier)

  ```jsx
  // tệ
  <Foo bar='bar' />

  // tốt
  <Foo bar="bar" />

  // tệ
  <Foo style={{ left: "20px" }} />

  // tốt
  <Foo style={{ left: '20px' }} />
  ```

## Khoảng trắng

- Luôn luôn có duy nhất một kí tự space(khoảng trắng) trong thẻ tự đóng. (eslint + Prettier)

  ```jsx
  // tệ
  <Foo/>

  // rất tệ
  <Foo                 />

  // tệ
  <Foo
  />

  // tốt
  <Foo />
  ```

- Không dùng khoảng trắng giữa giá trị bên trong ngoặc nhọn. (eslint + Prettier)

  ```jsx
  // tệ
  <Foo bar={ baz } />

  // tốt
  <Foo bar={baz} />
  ```

## Props

- Luôn luôn sử dụng camelCase khi đặt tên prop (camelCase : viết hoa chữa cái đầu của các từ , từ đầu tiên của cụm thì viết thường) (eslint + Prettier)

  ```jsx
  // tệ
  <Foo
    UserName="hello"
    phone_number={12345678}
  />

  // tốt
  <Foo
    userName="hello"
    phoneNumber={12345678}
  />
  ```

- Bỏ giá trị của prop khi nó thực sự rõ ràng là `true`.

  ```jsx
  // tệ
  <Foo
    hidden={true}
  />

  // tốt
  <Foo hidden />
  ```

- Luôn luôn sử dụng prop `alt` trong thẻ `<img>`. Nếu giá trị của thẻ là NULL , `alt` có thể là một chuỗi rỗng hoặc `<img>` phải có thuộc tính `role="presentation"`. (eslint + Prettier)

  ```jsx
  // tệ
  <img src="hello.jpg" />

  // tốt
  <img src="hello.jpg" alt="Me waving hello" />

  // tốt
  <img src="hello.jpg" alt="" />

  // tốt
  <img src="hello.jpg" role="presentation" />
  ```

- Tránh dùng chỉ số của mảng(index) cho thuộc tính `key`, nên sử dụng một unique ID(định danh duy nhất).

  ```jsx
  // tệ
  {
    todos.map((todo, index) => <Todo {...todo} key={index} />);
  }

  // tốt
  {
    todos.map((todo) => <Todo {...todo} key={todo.id} />);
  }
  ```

- Luôn xác định rõ ràng các defaultProp(thuộc tính mặc định) cho tất cả non-required props(thuộc tính không bắt buộc).(Props Type)

  ```jsx
  // tệ
  function SFC({ foo, bar, children }) {
    return (
      <div>
        {foo}
        {bar}
        {children}
      </div>
    );
  }
  SFC.propTypes = {
    foo: PropTypes.number.isRequired,
    bar: PropTypes.string,
    children: PropTypes.node,
  };

  // tốt
  function SFC({ foo, bar, children }) {
    return (
      <div>
        {foo}
        {bar}
        {children}
      </div>
    );
  }
  SFC.propTypes = {
    foo: PropTypes.number.isRequired,
    bar: PropTypes.string,
    children: PropTypes.node,
  };
  SFC.defaultProps = {
    bar: '',
    children: null,
  };
  ```

- Ghi chú: Nên lọc các props không cần thiết khi có thể.

  ```jsx
  // tốt
  render() {
    const { irrelevantProp, ...relevantProps  } = this.props;
    return <WrappedComponent {...relevantProps} />
  }

  // tệ
  render() {
    const { irrelevantProp, ...relevantProps  } = this.props;
    return <WrappedComponent {...this.props} />
  }
  ```

## Refs

- Luôn sử dụng hàm gọi lại(callback) cho khai báo ref. (eslint)

  ```jsx
  // tệ
  <Foo
    ref="myRef"
  />

  // tốt
  <Foo
    ref={(ref) => { this.myRef = ref; }}
  />
  ```

## Dấu ngoặc đơn

- Đóng gói các thẻ JSX trong ngoặc đơn khi chúng kéo dài nhiều dòng.(eslint + pretier)

  ```jsx
  // tệ
  render() {
    return <MyComponent variant="long body" foo="bar">
             <MyChild />
           </MyComponent>;
  }

  // Tốt
  render() {
    return (
      <MyComponent variant="long body" foo="bar">
        <MyChild />
      </MyComponent>
    );
  }

  // Tốt, Khi chỉ có 1 dòng
  render() {
    const body = <div>hello</div>;
    return <MyComponent>{body}</MyComponent>;
  }
  ```

## Thẻ

- Luôn luôn tự đóng các thẻ(tags) không có con. (eslint + pretier)

  ```jsx
  // tệ
  <Foo variant="stuff"></Foo>

  // tốt
  <Foo variant="stuff" />
  ```

- Nếu Component của bạn có thuộc tính nhiều dòng, hãy đóng thẻ đó trên 1 dòng mới. (eslint + pretier)

  ```jsx
  // tệ
  <Foo
    bar="bar"
    baz="baz" />

  // tốt
  <Foo
    bar="bar"
    baz="baz"
  />
  ```

## Phương thức

- Sử dụng arrow function để bao đóng các biến cục bộ.

  ```jsx
  function ItemList(props) {
    return (
      <ul>
        {props.items.map((item, index) => (
          <Item key={item.key} onClick={() => todo(item.name, index)} />
        ))}
      </ul>
    );
  }
  ```

- Các hàm binding được gọi trong lúc render nên đặt ở trong hàm khởi tạo(constructor).

  ```jsx
  // tệ
  class MyComponent extends React.Component {
    onClickDiv() {
      // làm việc gì đó
    }

    render() {
      return <div onClick={this.onClickDiv.bind(this)} />;
    }
  }

  // tốt
  class MyComponent extends React.Component {
    constructor(props) {
      super(props);

      this.onClickDiv = this.onClickDiv.bind(this);
    }

    onClickDiv() {
      // Làm gì đó vui vẻ
    }

    render() {
      return <div onClick={this.onClickDiv} />;
    }
  }
  ```

## Cách sắp xếp hàm

- Các hàm trong `class extends React.Component` nên được viết theo thứ tự sau:

1.  Các phương thức tĩnh `static` (không bắt buộc)
1.  `constructor`
1.  `getChildContext`
1.  `componentWillMount`
1.  `componentDidMount`
1.  `shouldComponentUpdate`
1.  `componentWillUpdate`
1.  `componentDidUpdate`
1.  `componentWillUnmount`
1.  _Hàm xử lí sự kiện như click hoặc submit_ `onClickSubmit()` & `onChangeDescription()`
1.  _Các hàm lấy dữ liệu cho hàm `render`_ chẳng hạn như `getSelectReason()` hay `getFooterContent()`
1.  _Các hàm render khác_ như `renderNavigation()` hay `renderProfilePicture()`
1.  `render`

- Cách định nghĩa `propTypes`, `defaultProps`, `contextTypes`, ...

  ```jsx
  import React from 'react';
  import PropTypes from 'prop-types';

  const propTypes = {
    id: PropTypes.number.isRequired, // Nếu id không đúng kiểu number, màn hình console sẽ hiện ra cảnh báo
    url: PropTypes.string.isRequired, // Nếu url không đúng kiểu string, màn hình console sẽ hiện ra cảnh báo
    text: PropTypes.string, // Nếu text không đúng kiểu string, màn hình console sẽ hiện ra cảnh báo
  };

  const defaultProps = {
    text: 'Hello World', // Gán giá trị mặc định cho text
  };

  class Link extends React.Component {
    static methodsAreOk() {
      return true;
    }

    render() {
      return (
        <a href={this.props.url} data-id={this.props.id}>
          {this.props.text}
        </a>
      );
    }
  }

  Link.propTypes = propTypes;
  Link.defaultProps = defaultProps;

  export default Link;
  ```

## Extensions for VSCode (Plugin cho việc Code - nên cài để thống nhất team, hỗ trợ coding convension)

[Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)

- Thằng này giúp tô màu các dấu ()[]{}, nhìn 1 phát là biết cái nào đi cặp với cái nào, không còn lẫn lộn, thừa thiếu dấu ...

[Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

- Thằng này giúp ta kiểm tra viết comment sai chính tả, đặt tên hàm, tên biến theo chuẩn camelCase code. Extension này sẽ highlight những đoạn sai chính tả để mình sửa.

[ES7 React/Redux/GraphQL/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

- Thằng này giúp chúng ta code nhanh hơn bằng việc đã gom những hàm viết tắt(clg → console.log(object))

[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

- Thằng ESLint sẽ giúp ta code đúng chuẩn, đúng format, tìm những lỗi linh tinh khi code. Còn thằng Prettier sẽ hỗ trợ bạn format code, sửa theo đúng chuẩn từ ESLint.
- Cài 2 thằng này xong, chỉ cần code đại rồi Ctrl S để save 1 phát là code vừa đẹp vừa chuẩn.

[GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

- Thằng này hỗ trợ pull/push từ Git, giúp biết từng dòng code do ai viết, viết vào lúc nào, nằm trong commit nào. Cũng có thể …. ngược về quá khứ để xem file đã thay đổi như thế nào...

[Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)
[Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)

- Thằng này giúp ta khi code HTML/JSX, mỗi khi tạo thêm tag mới, extension sẽ đóng tag để khỏi quên. Khi đổi tên tag, extension này sẽ đổi tên closing tag cho phù hợp luôn.

[Auto Import](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)

- Thằng này hỗ trợ mình Import thư viện JavaScript, component từ các file khác

[Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)

- Thằng này thêm vào cho đẹp dễ nhận ra các folder, file đặc biệt

[Path Intellisense](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)

- Thằng này giúp gợi ý tên npm package, tên file trong thư mục khi mình cần import, giúp giảm lỗi khi import
